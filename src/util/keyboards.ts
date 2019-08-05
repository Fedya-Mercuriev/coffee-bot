import { Markup, ContextMessageUpdate, CallbackButton } from "telegraf";
import generateRandomString from './generate-random-string';
import _ from "lodash";

/**
 * @param ctx - message update object
 * @param options - an object with
* */
export function buildMenu(ctx: ContextMessageUpdate, options: any): any {
    let result: Array<CallbackButton>[] = [];

    for (let item in options) {
        if (options.hasOwnProperty(item)) {
            const title:string = options[item].title.replace(options[item].title.charAt(0), options[item].title.charAt(0).toUpperCase());
            const data:any = composeCallbackData(ctx, options[item].data);

            result.push([
                Markup.callbackButton(title, data)
            ]);
        }
    }

    return Markup.inlineKeyboard(result);
}

export async function addBackButton(ctx: ContextMessageUpdate, menu: any): Promise<EnumerableObject> {
    return Object.assign({}, menu, {
        back: {
            title: ctx.i18n.t('buttons.back'),
            data: {
                scene: await ctx.botScenes.previousScene(ctx)
            }
        }
    });
}

function composeCallbackData(ctx: ContextMessageUpdate, menuItems: any):any {
    let objectAccessor:string = generateRandomString(8);
    let data:any = {};

    for (let key in menuItems) {
        if (menuItems.hasOwnProperty(key)) {
            if (key !== 'title') {
                data[key] = menuItems[key];
            }
        }
    }
    /*
     Object accessor is used to get an object with all necessary data
     Unfortunately telegram only allows 64-bit data, that's why have to
     store object in a separate property
    * */
    while (ctx.session.currentMenu.has(objectAccessor)) {
        objectAccessor = generateRandomString(8);
    }
    ctx.session.currentMenu.set(objectAccessor, data);
    return objectAccessor;
}