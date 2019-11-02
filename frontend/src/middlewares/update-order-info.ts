import { ContextMessageUpdate } from 'telegraf';
import _ from 'lodash';
import {
  composeOrderInfoMessage,
  updateOrderInfoMsg
} from '../controllers/order/helpers';

export default async function updateOrderInfo(
  ctx: ContextMessageUpdate,
  next: Function
) {
  if (ctx.updateType === 'callback_query') {
    const args = ctx.session.currentMenu.get(ctx.update.callback_query.data);

    if (args.order) {
      await ctx.answerCbQuery(`${ctx.i18n.t('status.update_order')}...`);
      const orderItems = _.pickBy(args.order, (value, key) => key !== 'type');
      const orderSection = ctx.session.order.getOrderItem(args.order.type);

      for (let prop in orderItems) {
        orderSection[prop] = orderItems[prop];
      }
      const orderInfo = await composeOrderInfoMessage(ctx);
      await updateOrderInfoMsg(ctx, orderInfo);
    }
    return next();
  }
  return next();
}
