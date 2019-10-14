import { ContextMessageUpdate } from 'telegraf';

/**
 * Removes messages collecting in scene
 * @param ctx - Message update object
 * */
export default async function clearScene(ctx: ContextMessageUpdate) {
  if (ctx.session.messages.hasMessages()) {
    const messages = ctx.session.messages.storage;
    for (let [key, message_id] of messages) {
      await ctx.telegram.deleteMessage(ctx.chat.id, message_id);
      await messages.delete(key);
    }
  }
}
