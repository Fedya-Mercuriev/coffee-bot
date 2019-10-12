import { ContextMessageUpdate } from 'telegraf';

export default async function deleteMessage(
  ctx: ContextMessageUpdate,
  messageData: any
): Promise<boolean> {
  let message;
  if (typeof messageData === 'number') {
    message = messageData;
  } else {
    message = messageData.messageId;
  }
  try {
    await ctx.telegram.deleteMessage(ctx.chat.id, message);
    return true;
  } catch (e) {
    return false;
  }
}
