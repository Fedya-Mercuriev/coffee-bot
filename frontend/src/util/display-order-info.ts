import { ContextMessageUpdate } from 'telegraf';
import { ReturnedMessage } from 'vendor';

export default async function displayOrderInfo(
  ctx: ContextMessageUpdate
): Promise<ReturnedMessage> {
  return await ctx.replyWithHTML(ctx.session.orderInfoMsg, {
    parse_mode: 'HTML',
    disable_notification: true
  });
}
