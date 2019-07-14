import { Markup, ContextMessageUpdate, CallbackButton } from "telegraf";
import generateRandomString from './generate-random-string';

export function buildMenu(options: any ): any {
    let result: Array<CallbackButton>[] = [];

    for (let item in options) {
        result.push([
            Markup.callbackButton(options[item].title, JSON.stringify(options[item].data))
        ]);
    }

    return Markup.inlineKeyboard(result);
}

export function buildOrderMenu(ctx: ContextMessageUpdate, menuItems: any):any {
    let result: Array<CallbackButton>[] = [];

    for (let item in menuItems) {
        let objectAccessor:string = generateRandomString(8);
        let data:any = {};
        let title:string = '';

        for (let key in menuItems[item]) {
            if (key === 'title') {
                title = menuItems[item][key];
            } else {
                data[key] = menuItems[item][key];
            }
        }
        /*
         Object accessor is used to get an object with all necessary data
         Unfortunately telegram only allows 64-bit data, that's why have to
         store object in a separate property
        * */
        if (ctx.session.currentMenu.has(objectAccessor)) {
            objectAccessor = generateRandomString(8);
        }
        ctx.session.currentMenu.set(objectAccessor, data);
        console.log(ctx.session.currentMenu.get(objectAccessor));
        result.push([
            Markup.callbackButton(title, JSON.stringify({order: objectAccessor}))
        ]);
    }
    return Markup.inlineKeyboard(result);
}