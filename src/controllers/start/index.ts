import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import app from '../../_app';
import navigateToScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { buildMenu } from '../../util/keyboards';
import clearScene from '../../util/clear-scene';

const sceneId = 'start';
const { Leave } = Stage;
const start = new Scene(sceneId);

start.use(
    navigateToScene,
    invokeFunction
);

start.enter(async(ctx: ContextMessageUpdate) => {
    const menuStructure = {
        order: {
            title: ctx.i18n.t('menus.main.order'),
            data: {
                scene: 'order'
            }
        },
        cart: {
            title: ctx.i18n.t('menus.main.cart'),
            data: {
                scene: 'cart'
            }
        },
        about: {
            title: ctx.i18n.t('menus.main.about'),
            data: {
                scene: 'about'
            }
        },
        contacts: {
            title: ctx.i18n.t('menus.main.contacts'),
            data: {
                scene: 'contacts'
            }
        }
    };

    if (!ctx.session.started) {
        await app.start(ctx);

        ctx.botScenes.iAmHere(ctx, sceneId);
        ctx.session.messages.storage = await ctx.reply(ctx.i18n.t('scenes.start.welcome'), buildMenu(menuStructure).extra());
    } else {
        await clearScene(ctx);
        ctx.session.messages.storage = await ctx.editMessageText(ctx.i18n.t('scenes.start.welcome'), buildMenu(menuStructure).extra());
    }
});

export default start;