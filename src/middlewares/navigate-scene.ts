import { ContextMessageUpdate } from "telegraf";

export default async function navigateToScene(ctx: ContextMessageUpdate, next: Function) {
    if (ctx.updateType === 'callback_query') {
        await ctx.answerCbQuery();
        const args = JSON.parse(ctx.update.callback_query.data);
        const sceneLink = (args.scene) ? args.scene : ctx.session.currentMenu.get(args.order).scene;

        if (sceneLink) {
            ctx.scene.leave();
            ctx.botScenes.iAmHere(ctx, sceneLink);
            ctx.scene.enter(sceneLink);
        } else {
            return next();
        }
    } else {
        return next();
    }
}