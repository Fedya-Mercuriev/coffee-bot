import { ContextMessageUpdate } from 'telegraf';
import generateRandomString from './util/generate-random-string';
import _ from 'lodash';
import { ReturnedMessage, CustomMessage, Operation } from 'vendor';
import createRouter from './util/router';

class App {
  private sorted: boolean;
  private stack: Operation[];

  public constructor() {
    this.sorted = false;
    this.stack = [];
  }

  // Returns an array of names without any possible junk
  /**
   * @param name - a function name to be normalized before being called
   * */
  static normalizeName(name: string): string[] {
    return name.split(' ').map(name => name.trim());
  }

  // Accesses a callback by the scene name and the function name
  /**
   * @param scene - a scene in which the desired function will be called
   * @param name - function name to be invoked
   * @param args - arguments to be passed to the invoked function
   * */
  public call(name: string, ...args: any): void {
    const normalizedScope = App.normalizeName(name);

    if (!this.sorted) {
      this.stack.sort((a, b) => {
        if (a.order === b.order) {
          return 0;
        }
        return a.order > b.order ? 1 : -1;
      });
      this.sorted = true;
    }

    this.stack
      .filter(operation => operation.name === name)
      .map(operation => operation.callback.apply(this, args));
  }

  // Binds a callback, that'll be accessed by it's name and will be invoked
  /**
   * @param name - a name of teh function to be bound
   * @param callback - a function itself
   * @param order - an order of invocation (will be used by the start mechanism to determine the invocation order)
   * */
  public bind(name: string, callback: Function, order?: number): void {
    let functionNames: string[] = App.normalizeName(name);

    if (_.find(functionNames, name)) {
      console.error('The function with this name already exists!');
      return;
    }

    if (order === undefined) {
      order = 0;
    }

    this.stack.push({ name, callback, order });
  }

  // Invokes all operations at the start of the app
  public async start(ctx: ContextMessageUpdate): Promise<any> {
    ctx.session.started = true;
    ctx.session.messages = {
      _messages: new Map(),
      get storage() {
        return this._messages;
      },
      set storage(messageObj: ReturnedMessage | CustomMessage) {
        if (typeof messageObj !== 'boolean') {
          if (!messageObj.key) {
            const { message_id } = messageObj;
            let key = generateRandomString(15, this._messages);

            this._messages.set(key, message_id);
            // This block of code gets executed when a object with a desired key and message id is provided
          } else {
            const { key, message } = messageObj;
            const { message_id } = message;
            this._messages.set(key, message_id);
          }
        } else {
          return;
        }
      },
      getMessage(key: string): string {
        if (this._messages.has(key)) {
          return this._messages.get(key);
        }
        console.error(`Нет сообщения с ключом '${key}'`);
      },
      hasMessage(key: string): boolean {
        return this._messages.has(key);
      },
      hasMessages() {
        return this._messages.size > 0;
      },
      delete(key: string) {
        this.messages.delete(key);
      },
      isNotEmpty(): boolean {
        return this._messages.size > 0;
      },
      clearStorage() {
        this._messages.clear();
      }
    };
    ctx.session.scenesMap = [];
    ctx.session.currentMenu = new Map();
    ctx.session.isAdmin = false;
    ctx.session.token = null;
    createRouter(ctx);
  }
}

const app = new App();
export default app;
