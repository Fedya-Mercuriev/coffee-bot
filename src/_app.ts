import { ContextMessageUpdate } from "telegraf";
import _ from 'lodash';

class App {
    stack: Stack;

    constructor() {
        this.stack = {};
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
    call(scene:string, name: string, ...args: any): void {
        const normalizedScope = App.normalizeName(name);

        if (!this.stack[scene].sorted) {
            this.stack[scene].operations.sort((a, b) => {
                if (a.order === b.order) {
                    return 0;
                }
                return (a.order > b.order) ? 1 : -1;
            });
            this.stack[scene].sorted = true;
        }

        this.stack[scene].operations
            .filter(operation => operation.name === name)
            .map(operation => operation.callback.apply(this, ...args))
    }

    // Binds a callback, that'll be accessed by it's name and will be invoked
    /**
     * @param sceneName - a name of the scene to which the function will be bound
     * @param name - a name of teh function to be bound
     * @param callback - a function itself
     * @param order - an order of invocation (will be used by the start mechanism to determine the invocation order)
     * */
    bind(sceneName: string, name: string, callback: Function, order?: number): void {
        let functionNames: string[] = App.normalizeName(name);

        if (_.find(functionNames, name)) {
            console.error('The function with this name already exists!');
            return;
        }

        if (order === undefined) {
            order = 0;
        }
        this.stack[sceneName].operations.push({ name, callback, order });
    }

    // Invokes all operations at the start of the app
    start(ctx: ContextMessageUpdate) {
        if (this.stack.default) {
            this.stack.default.operations.map(operation => operation.callback.call(ctx));
        } else {
            console.warn('No default operations were assigned!');
        }
    }
}

const app = new App();
export default app;