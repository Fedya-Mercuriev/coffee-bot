import { Markup, ContextMessageUpdate, CallbackButton } from "telegraf";

export function buildMenu(options: any ): any {
    let result: Array<CallbackButton>[] = [];

    for (let item in options) {
        const data:any = {};
        let title = '';

        if (!options[item].data) {
            for (let key in options[item]) {
                if (key === 'title') {
                    title = options[item][key];
                } else {
                    data[key] = options[item][key];
                }
            }

            result.push([
                Markup.callbackButton(title, JSON.stringify(data))
            ]);
        } else {
            result.push([
                Markup.callbackButton(options[item].title, JSON.stringify(options[item].data))
            ]);

        }
    }

    return Markup.inlineKeyboard(result);
}