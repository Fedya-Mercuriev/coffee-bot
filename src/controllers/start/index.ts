import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { processCbData } from "./middlewares";
import { getMenu } from '../../util/keyboards';

const { Leave } = Stage;
const start = new Scene('start');

start.use(processCbData);

start.enter(async (ctx: ContextMessageUpdate) => {
    const menuStructure = [
        {
            title: ctx.i18n.t('menus.main.order'),
            data: {
                scene: 'order'
            }
        },
        {
            title: ctx.i18n.t('menus.main.cart'),
            data: {
                scene: 'cart'
            }
        },
        {
            title: ctx.i18n.t('menus.main.about'),
            data: {
                scene: 'about'
            }
        },
        {
            title: ctx.i18n.t('menus.main.contacts'),
            data: {
                scene: 'contacts'
            }
        }
    ];
    const menu = getMenu(ctx, menuStructure);
    await ctx.reply(ctx.i18n.t('scenes.start.welcome'), menu.extra());
});
start.command('menu', (ctx: ContextMessageUpdate) => {
    ctx.scene.enter('menu');
});

export default start;