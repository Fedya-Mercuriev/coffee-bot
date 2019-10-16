import { ContextMessageUpdate } from 'telegraf';

async function isPrevNextScene(
  ctx: ContextMessageUpdate,
  targetScene: string
): Promise<string> {
  // Here we identify whether the scene user navigates to is next or previous
  if (targetScene !== (await ctx.botScenes.previousScene(ctx))) {
    return 'next';
  } else {
    return 'prev';
  }
}

async function updateRoutes(ctx: ContextMessageUpdate) {
  ctx.session.route = ctx.session.currentMenu.get(
    ctx.update.callback_query.data
  ).url;
}

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
