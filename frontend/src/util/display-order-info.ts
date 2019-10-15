import { ContextMessageUpdate } from 'telegraf';
import { displayError } from './error-handler';

export default async function displayOrderInfo(
  ctx: ContextMessageUpdate
): Promise<void> {
  if (!ctx.session.messages.hasMessage('orderInfo')) {
    ctx.session.messages.storage = {
      key: 'orderInfo',
      message: await ctx.replyWithHTML(ctx.session.orderInfoMsg, {
        parse_mode: 'HTML',
        disable_notification: true
      })
    };
  } else {
    ctx.session.messages.storage = {
      key: 'orderInfo',
      message: await ctx.editMessageText(ctx.session.orderInfoMsg, {
        parse_mode: 'HTML',
        disable_notification: true
      })
    };
  }
}
