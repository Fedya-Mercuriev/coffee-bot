import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import { updateOrderInfoMsg, composeOrderInfoMessage, finish } from './helpers';

export async function updateOrderInfo(
  ctx: ContextMessageUpdate,
  next: Function
) {
  if (ctx.updateType === 'callback_query') {
    const args = ctx.session.currentMenu.get(ctx.update.callback_query.data);

    if (args.order) {
      await ctx.answerCbQuery(`${ctx.i18n.t('status.update_order')}...`);

      for (let prop in ctx.session.order) {
        if (ctx.session.order.hasOwnProperty(prop) && args.order[prop]) {
          ctx.session.order[prop] = args.order[prop];
        }
      }
      const orderInfo = await composeOrderInfoMessage(ctx);
      await updateOrderInfoMsg(ctx, orderInfo);
    }
    return next();
  }
  return next();
}

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
