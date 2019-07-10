import { ContextMessageUpdate } from "telegraf";

/**
* Removes messages collecting in scene
* @param ctx - Message update object
* */
export default async function clearScene(ctx: ContextMessageUpdate) {
    if (ctx.session.sceneMessages && ctx.session.sceneMessages.length) {
        ctx.session.sceneMessages.map(async (msg) => {
            await ctx.telegram.deleteMessage(ctx.chat.id, msg);
        })
    }
}