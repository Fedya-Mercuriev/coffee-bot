import { ContextMessageUpdate } from "telegraf";

export default async function navigateToScene(ctx: ContextMessageUpdate, next: Function) {
    if (ctx.updateType === 'callback_query') {
        await ctx.answerCbQuery();
        const args = ctx.session.currentMenu.get(ctx.update.callback_query.data);

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