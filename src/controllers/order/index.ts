import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';

const { leave } = Stage;
const menu = new Scene('menu');

menu.enter(async (ctx: ContextMessageUpdate) => {
    await ctx.reply(ctx.i18n.t('scenes.order.welcome'));
});

menu.leave((ctx: ContextMessageUpdate) => {
    console.log('Вышли из сцены');
});

menu.command('back', leave());

export default menu;