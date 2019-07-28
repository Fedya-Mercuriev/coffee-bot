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
        const { message_id } = await displayOrderInfo(ctx);
        ctx.session.messages.storage = {
            key: 'orderInfo',
            message_id
        };
        await ctx.reply(ctx.i18n.t('scenes.order.welcome'), buildOrderMenu(ctx, menu).extra());
    } else {
        const { message_id } = await displayOrderInfo(ctx);
        ctx.session.messages.storage = {
            key: 'orderInfo',
            message_id
        };
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