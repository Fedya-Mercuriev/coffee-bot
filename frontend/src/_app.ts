import { ContextMessageUpdate } from 'telegraf';
import generateRandomString from './util/generate-random-string';
import _ from 'lodash';
import { ReturnedMessage, CustomMessage, Operation } from 'vendor';

/**
 * @param ctx - message update object
 * Adds an object responsible for storing and updating routes (urls for GET requests)
 */
function createRouter(ctx: ContextMessageUpdate): void | string {
  ctx.session.router = {
    current: null,
    previous: null
  };
  ctx.session.prevRoute = async function(
    url?: string
  ): Promise<string | boolean> {
    if (url) {
      this.router.previous = url;
      return true;
    }
    return this.router.previous ? this.router.previous : false;
  };
  ctx.session.currentRoute = function(url?: string): string | boolean {
    if (url) {
      this.router.current = url;
      return true;
    }
    return this.router.current ? this.router.current : false;
  };
}

class App {
  sorted: boolean;
  stack: Operation[];

  constructor() {
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
  call(name: string, ...args: any): void {
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
      .map(operation => operation.callback.apply(this, ...args));
  }

  // Binds a callback, that'll be accessed by it's name and will be invoked
  /**
   * @param name - a name of teh function to be bound
   * @param callback - a function itself
   * @param order - an order of invocation (will be used by the start mechanism to determine the invocation order)
   * */
  bind(name: string, callback: Function, order?: number): void {
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
  start(ctx: ContextMessageUpdate) {
    ctx.session.started = true;
    ctx.session.messages = {
      _messages: new Map(),
      get storage() {
        return this._messages;
      },
      set storage(message: ReturnedMessage | CustomMessage) {
        if (typeof message !== 'boolean') {
          if (!message.key) {
            const { message_id } = message;
            let key = generateRandomString(15);

            // Generate new key for accessing message repeatedly until it's unique
            while (this._messages.has(key)) {
              key = generateRandomString(15);
            }

            this._messages.set(key, message_id);
            // This block of code gets executed when a object with a desired key and message id is provided
          } else {
            const { key, message_id } = message;
            this._messages.set(key, message_id);
          }
        } else {
          return;
        }
      },
      hasMessages() {
        return this._messages.size > 0;
      },
      clearStorage() {
        this._messages.clear();
      }
    };
    ctx.session.scenesMap = [];
    ctx.session.currentMenu = new Map();
    createRouter(ctx);
  }
}

const app = new App();
export default app;
