import {ContextMessageUpdate} from "telegraf";

export function init(ctx: ContextMessageUpdate):void {
    ctx.session.order = {
        drink: null,
        amount: null,
        additions: null
    };
    ctx.session.orderInfoMsg = `* ${ctx.i18n.t('scenes.order.orderInfoContent')} *`;
    ctx.session.menu = {};
}

export function updateOrderInfo(ctx: ContextMessageUpdate) {
    if (ctx.updateType === 'callback_query') {
        ctx.answerCbQuery('Обновляю ваш заказ...');
        const args:OrderData = JSON.parse(ctx.update.callback_query.data);

        if (args.order) {
            ctx.session.order[args.order.select] = args.order.value;
        }
    }
}

export async function addNavigationToStructure(ctx: ContextMessageUpdate, items: any):Promise<any> {
    let result = {};

    for (let key in items) {
        if (items[key].amount) {
            items.scene = 'order_amount';
        } else {
            items.scene = 'order_additions';
        }
    }
    return result;
}

export function finish(ctx: ContextMessageUpdate):void {
    delete ctx.session.order;
}