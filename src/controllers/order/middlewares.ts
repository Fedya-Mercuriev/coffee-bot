import _ from 'lodash';
import { ContextMessageUpdate } from "telegraf";
import { updateOrderInfoMsg, composeOrderInfoMessage } from "./helpers";

export async function updateOrderInfo(ctx: ContextMessageUpdate, next: Function) {
    if (ctx.updateType === 'callback_query') {
        const args = JSON.parse(ctx.update.callback_query.data);

        if (args.order) {
            await ctx.answerCbQuery('Обновляю ваш заказ...');
            const orderData = await ctx.session.currentMenu.get(args.order);

            for (let prop in ctx.session.order) {
                if (orderData.order.hasOwnProperty(prop)) {
                    ctx.session.order[prop] = orderData.order[prop];
                }
            }
            const orderInfo = await composeOrderInfoMessage(ctx);
            await updateOrderInfoMsg(ctx, orderInfo);
        }
        return next();
    }
    return next();
}