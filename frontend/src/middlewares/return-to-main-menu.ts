import { ContextMessageUpdate } from 'telegraf';
import { finish } from '../controllers/order/helpers';

export async function returnToMainMenu(
  ctx: ContextMessageUpdate,
  next: Function
) {
  if (ctx.updateType === 'callback_query') {
    const args = ctx.session.currentMenu.get(ctx.update.callback_query.data);

    if (args.scene === ctx.session.scenesMap[0]) {
      await ctx.answerCbQuery(`${ctx.i18n.t('status.return_main_menu')}...`);
      await finish(ctx);
      ctx.botScenes.iAmHere(ctx, args.scene);
      return next();
    } else {
      return next();
    }
  }
}
