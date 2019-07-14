import { Markup, ContextMessageUpdate, CallbackButton } from "telegraf";

export function buildMenu<T>(ctx: ContextMessageUpdate, options: T[] ): any {
    let result: Array<CallbackButton>[] = [];

    options.forEach((item: any) => {
        result.push([
            Markup.callbackButton(item.title, JSON.stringify(item.data))
        ])
    });

    return Markup.inlineKeyboard(result);
}