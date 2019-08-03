import { Markup, ContextMessageUpdate, CallbackButton } from "telegraf";
import generateRandomString from './generate-random-string';
import _ from "lodash";

export function buildMenu(options: any ): any {
    let result: Array<CallbackButton>[] = [];

    for (let item in options) {
        if (options.hasOwnProperty(item)) {
            let title:string = options[item].title.replace(options[item].title.charAt(0), options[item].title.charAt(0).toUpperCase());

            result.push([
                Markup.callbackButton(title, JSON.stringify(options[item].data))
            ]);
        }
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
            if (menuItems[item].hasOwnProperty(key)) {
                if (key === 'title') {
                    title = menuItems[item].title.replace(menuItems[item].title.charAt(0), menuItems[item].title.charAt(0).toUpperCase());
                } else {
                    data[key] = menuItems[item][key];
                }
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
        result.push([
            Markup.callbackButton(title, JSON.stringify({order: objectAccessor}))
        ]);
    }
    return Markup.inlineKeyboard(result);
}