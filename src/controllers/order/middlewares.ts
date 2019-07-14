import _ from 'lodash';
import { ContextMessageUpdate } from "telegraf";
import { getAdditionsString } from "./helpers";


export function composeOrderInfoMessage(ctx: ContextMessageUpdate, next: Function) {
    if (ctx.updateType === 'callback_query') {
        console.log('Запускаем composeOrderInfoMessage');
        let messageContent = `Вы выбрали:\n`;
        let drink = ctx.session.order.drink;
        let amount = ctx.session.order.amount;
        let additions = ctx.session.order.additions;

        if (drink) {
            messageContent += `<b>${drink}</b>`;
            if (typeof amount === 'object') {
                messageContent += `(${amount.title})`
            }
            messageContent += '\n';
        }
        // Composing additions list
        if (_.isArray(additions) && additions.length) {
            let additionsString = '';

            // Adding a title for section
            messageContent+= `<b>${ctx.i18n.t('orderItems.additions')}</b>\n`;
            additionsString = getAdditionsString(additions);
            messageContent += additionsString;
        }
        return next();
    } else {
        return next();
    }
}

export function updateOrderInfo(ctx: ContextMessageUpdate, next: Function) {
    console.log('Запускаем updateOrderInfo');
    if (ctx.updateType === 'callback_query') {
        ctx.answerCbQuery('Обновляю ваш заказ...');
        const args = JSON.parse(ctx.update.callback_query.data);

        if (args.order) {
            const orderData = ctx.session.currentMenu.get(args.order);
            Object.keys(orderData).forEach((item) => {
                ctx.session.order[item] = args.order[item];
            });
            console.log(JSON.stringify(ctx.session.order));
        }
        return next();
    }
    return next();
}