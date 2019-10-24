import { ContextMessageUpdate } from 'telegraf';
import updateRoutes from '../util/update-routes';

export default async function navigateToScene(
  ctx: ContextMessageUpdate,
  next: Function
) {
  if (ctx.updateType === 'callback_query') {
    await ctx.answerCbQuery();
    const args = ctx.session.currentMenu.get(ctx.update.callback_query.data);

    if (args.scene) {
      if (args.url) {
        await updateRoutes(ctx);
      } else {
        ctx.session.route = null;
      }
      ctx.botScenes.iAmHere(ctx, args.scene);
      ctx.scene.enter(args.scene);
    } else {
      return next();
    }
  } else {
    return next();
  }
}
