import { ContextMessageUpdate } from "telegraf";

export async function deleteMessage(ctx: ContextMessageUpdate, message: any): Promise<boolean> {
    const { messageId } = message;
    try {
        await ctx.telegram.deleteMessage(ctx.chat.id, messageId);
        return true
    } catch(e) {
        return false;
    }
 }