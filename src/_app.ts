import { ContextMessageUpdate } from "telegraf";
import _ from 'lodash';

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
                return (a.order > b.order) ? 1 : -1;
            });
            this.sorted = true;
        }

        this.stack
            .filter(operation => operation.name === name)
            .map(operation => operation.callback.apply(this, ...args))
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
            _messages: [],
            get storage() {
              return this._messages;
            },
            set storage(message: ReturnedMessage|[]) {
                if (typeof message !== 'boolean' && !_.isArray(message)) {
                 const { message_id } = message;

                    if (this._messages.indexOf(message_id) === -1) {
                        this._messages.push(message_id);
                    }
                } else if (_.isArray(message)) {
                    this._messages.length = 0;
                } else {
                    return;
                }
            }

        };
        ctx.session.scenesMap = [];
    }
}

const app = new App();
export default app;