import { ContextMessageUpdate } from 'telegraf';
import _ from 'lodash';
import clearScene from '../../util/clear-scene';

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
export async function finish(ctx: ContextMessageUpdate):Promise<void> {
    delete ctx.session.order;
    await clearScene(ctx);
    ctx.session.messages.clearStorage();
}

/**
 * Processes given object and adds 'scene' property for navigating around desired scenes
 * @param items - an object of menu items in current menu
 * @param scenes - an array of scenes to be chosen a scene from
* */
export function navigationAdder(items:any, scenes: string[]) {
    let result:any = {};
    Object.keys(items).forEach((item:string) => {
        let productObject:any = {data: {
                order: <OrderObject>{},
                scene: null
            }};

        for (let key in items[item]) {
            if (key === 'title') {
                productObject.title = items[item][key];
            } else if (key === 'amount') {
                if (items[item][key]) {
                    productObject.data.scene = scenes[0];
                } else {
                    productObject.data.scene = scenes[1];
                }
            } else if (key === 'scene') {
                productObject.data.scene = items[item][key];
            } else {
                productObject.data.order[key] = items[item][key];
            }
        }
        result[item] = productObject;
    });
    return result;
}

/**
 * @param ctx - Context message update object
 * @param orderInfo - an object containing updated orderInfo
* */
export async function updateOrderInfoMsg(ctx: ContextMessageUpdate, orderInfo: string) {
    let editedMessage:ReturnedMessage|boolean = null;

    try {
        editedMessage = await ctx.telegram.editMessageText(
            ctx.chat.id,
            ctx.session.messages.storage.get('orderInfo'),
            null,
            orderInfo,
            {parse_mode: 'HTML'}
        );
    } catch(e) {
        return;
    }
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