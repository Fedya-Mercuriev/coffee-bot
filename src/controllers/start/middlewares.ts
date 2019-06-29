import { ContextMessageUpdate } from "telegraf";

export async function processCbData(ctx: ContextMessageUpdate, next: Function) {
    if (ctx.update.callback_query) {
        const args = JSON.parse(ctx.update.callback_query.data);
        if (args.scene) {
            ctx.scene.enter(args.scene);
        }
    } else {
        next();
    }
}