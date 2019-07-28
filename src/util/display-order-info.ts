import { ContextMessageUpdate } from "telegraf";

export default async function displayOrderInfo(ctx: ContextMessageUpdate): Promise<ReturnedMessage> {
    return await ctx.replyWithHTML(ctx.session.orderInfoMsg,
        {disable_notification: true});
}