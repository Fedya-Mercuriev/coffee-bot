import { ContextMessageUpdate } from "telegraf";

export default async function navigateToScene(ctx: ContextMessageUpdate, next: Function) {
    await ctx.answerCbQuery();
    if (Object.keys(ctx.update.callback_query.data).length) {
        const args = JSON.parse(ctx.update.callback_query.data);

        if (args.scene) {
            ctx.scene.leave();
            ctx.botScenes.iAmHere(ctx, args.scene);
            ctx.scene.enter(args.scene);
        } else {
            return next();
        }
    } else {
        return next();
    }
}