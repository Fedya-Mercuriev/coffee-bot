import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import app from '../../_app';
import navigateToScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import auth from '../../middlewares/auth';
import { displayMenu } from '../../util/keyboards';
import clearScene from '../../util/clear-scene';
import addLocaleToMenu from '../../util/add-locale';
import login from '../../util/login';
import MenuStructure from '../../util/prepare-menu-structure';

const sceneId = 'start';
const { Leave } = Stage;
const start = new Scene(sceneId);

start.use(auth, navigateToScene, invokeFunction);

start.enter(
  async (ctx: ContextMessageUpdate): Promise<any> => {
    let menuStructure: any = {
      order: {
        name: ctx.i18n.t('menus.main.order'),
        data: {
          scene: 'order',
          url: `${process.env.API_DOMAIN}/api/good_types/`
        }
      },
      cart: {
        name: ctx.i18n.t('menus.main.cart'),
        data: {
          scene: 'cart'
        }
      },
      about: {
        name: ctx.i18n.t('menus.main.about'),
        data: {
          scene: 'about'
        }
      },
      contacts: {
        name: ctx.i18n.t('menus.main.contacts'),
        data: {
          scene: 'contacts'
        }
      }
    };
    menuStructure = new MenuStructure(
      JSON.stringify(menuStructure)
    ).processButtons(addLocaleToMenu, ctx, 'menus.main');
    if (!ctx.session.started) {
      await app.start(ctx);
      await login(ctx);
      ctx.botScenes.iAmHere(ctx, sceneId);
      await displayMenu(ctx, menuStructure.menu, {
        message: ctx.i18n.t('scenes.start.welcome')
      });
    } else {
      await clearScene(ctx);
      await displayMenu(ctx, menuStructure.menu, {
        message: ctx.i18n.t('scenes.start.welcome')
      });
    }
  }
);

export default start;
