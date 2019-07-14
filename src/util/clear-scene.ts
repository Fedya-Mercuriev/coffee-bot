import { ContextMessageUpdate } from "telegraf";

/**
* Removes messages collecting in scene
* @param ctx - Message update object
* */
export default async function clearScene(ctx: ContextMessageUpdate) {
    if (ctx.session.messages.storage.length) {
        ctx.session.messages.storage.map(async (msg: number) => {
            await ctx.telegram.deleteMessage(ctx.chat.id, msg);
        })
    }
}