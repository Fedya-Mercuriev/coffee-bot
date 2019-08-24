import { ContextMessageUpdate } from "telegraf";
import app from '../../_app';

export default async function invokeFunction(ctx: ContextMessageUpdate, next: Function): Promise<Function> {
    if (ctx.updateType === 'callback_query') {
        await ctx.answerCbQuery();
        const args = ctx.session.currentMenu.get(ctx.update.callback_query.data);

        if (args.cb) {
            app.call(args.cb.name, args.cb.args);
        }
        return next();
    } else {
        return next();
    }
}