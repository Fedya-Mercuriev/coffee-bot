import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import { finish } from './helpers';

export async function returnToMainMenu(
  ctx: ContextMessageUpdate,
  next: Function
) {
  if (ctx.updateType === 'callback_query') {
    const args = ctx.session.currentMenu.get(ctx.update.callback_query.data);

    if (args.scene === ctx.session.scenesMap[0]) {
      await ctx.answerCbQuery(`${ctx.i18n.t('status.return_main_menu')}...`);
      await finish(ctx);
      return next();
    } else {
      return next();
    }
  }
}
