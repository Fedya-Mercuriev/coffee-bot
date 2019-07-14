import { ContextMessageUpdate } from "telegraf";

/**
 * Adds all necessary properties to session when order is started
 * @param ctx - context message update object
* */
export function init(ctx: ContextMessageUpdate):void {
    ctx.session.order = {
        title: null,
        amount: {
            title: null,
            value: null
        },
        price: null,
        additions: []
    };
    ctx.session.orderInfoMsg = `* ${ctx.i18n.t('scenes.order.orderInfoContent')} *`;
    ctx.session.currentMenu = new Map();
}

/**
 Adds links to scenes from the provided array depending on value of a desired property
 * @param items - an object of assumed menu items
 * @param scenes - an array of scenes (next(the scene that can be skipped) and the one after the next scene)
* */
export async function addNavigationToStructure(items: any, scenes: [string, string]):Promise<any> {
    let result:any = {};

    Object.keys(items).forEach((item:string) => {
        let productObject:any = {order: {}};

        for (let key in items[item]) {
            if (key === 'title') {
                productObject[key] = items[item][key];
            } else {
                if (key === 'amount') {
                    if (items[item][key]) {
                        productObject.scene = scenes[0];
                    } else {
                        productObject.scene = scenes[1];
                    }
                } else {
                    productObject.order[key] = items[item][key];
                }
            }
        }
        result[item] = productObject;
    });

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