import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';

const { leave } = Stage;
const menu = new Scene('menu');

menu.enter(async (ctx: ContextMessageUpdate) => {
    await ctx.reply(ctx.i18n.t('scenes.order.welcome'));
});

    if (!ctx.session.order) {
        init(ctx);
        ctx.session.messages.storage = await displayOrderInfo(ctx);
        await ctx.reply(ctx.i18n.t('scenes.order.welcome'), buildOrderMenu(ctx, menu).extra());
    } else {
        await displayOrderInfo(ctx);
        await ctx.editMessageText(ctx.i18n.t('scenes.order.welcome'), buildOrderMenu(ctx, menu).extra());
    }
});

order.leave((ctx: ContextMessageUpdate) => {
   if (_.some(ctx.session.order, _.isEmpty)) {
       finish(ctx);
   }
   ctx.session.currentMenu.clear();
});

menu.command('back', leave());

export default menu;