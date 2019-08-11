import { ContextMessageUpdate } from 'telegraf';
import _ from 'lodash';

/**
 * Adds all necessary properties to session when order is started
 * @param ctx - context message update object
* */
export function init(ctx: ContextMessageUpdate):void {
    ctx.session.order = {
        item: null,
        /*This property stores values both title for output on screen
        and value for making adding a drink of specific amount*/
        amount: {
            title: null,
            value: null
        },
        price: null,
        additions: []
    };
    ctx.session.orderInfoMsg = `* ${ctx.i18n.t('scenes.order.orderInfoContent')} *`;
}

/**
 Adds links to scenes from the provided array depending on value of a desired property
 * @param callback - a passed callback function that adds scenes
 * @param items - an object of assumed menu items
 * @param scenes - an array of scenes (next(the scene that can be skipped) and the one after the next scene)
* */
export async function addNavigationToStructure(callback: Function, items: any, scenes: string[]):Promise<any> {
    let result:any = {};
    const args = Array.prototype.slice.call(arguments, 1);

    result = callback.apply(this, args);
    return result;
}

/**
 * Returns a list with a string type from the chosen additions
 * @param additions - an array of chosen additions
* */
export function getAdditionsString(additions:any):string {
    let result = '';
    //TODO Сделать функцию, выдающую строку с списком добавок и их количеством
    return result;
}

/**
 * Deletes an object with properties necessary for order processing
 * @param ctx - context message update object
* */
export function finish(ctx: ContextMessageUpdate):void {
    delete ctx.session.order;
}

/**
 * @param ctx - Context message update object
 * @param orderInfo - an object containing updated orderInfo
* */
export async function updateOrderInfoMsg(ctx: ContextMessageUpdate, orderInfo: string) {
    const editedMessage:ReturnedMessage|boolean = await ctx.telegram.editMessageText(
        ctx.chat.id,
        ctx.session.messages.storage.get('orderInfo'),
        null,
        orderInfo,
        {parse_mode: 'HTML'}
    );
    if (!_.isBoolean(editedMessage)) {
        const { message_id } = editedMessage;
        ctx.session.messages.storage = {
            key: 'orderInfo',
            message_id
        };
    }
}

export async function composeOrderInfoMessage(ctx: ContextMessageUpdate):Promise<string> {
    let messageContent = `${ctx.i18n.t('scenes.order.orderInfoMsg')}:\n`;
    let title:string = ctx.session.order.item;
    let amount:Amount = ctx.session.order.amount;
    let additions:Addition[] = ctx.session.order.additions;
    let price:number = ctx.session.order.price;

    if (title) {
        messageContent += `<b>${_.startCase(title)}</b>`;
        if (typeof amount === 'object' && !_.every(amount, _.isNull)) {
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

    if (price) {
        messageContent += `${ctx.i18n.t('scenes.order.totalPrice')}: ${price}₽`;
    }
    return messageContent;
}