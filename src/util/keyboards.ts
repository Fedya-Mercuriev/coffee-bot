import { Markup, ContextMessageUpdate, CallbackButton } from "telegraf";

export function buildMenu(ctx: ContextMessageUpdate, options: Menu[]): any {
    let result: Array<CallbackButton>[] = [];

    options.forEach((item, index) => {
        result.push([
            Markup.callbackButton(item.title, JSON.stringify(item.data))
        ])
    });

    return Markup.inlineKeyboard(result);
}