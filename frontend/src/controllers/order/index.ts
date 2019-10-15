import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import MenuStructure from '../../util/prepare-menu-structure';
import load from '../../util/load';
import { displayMenu } from '../../util/keyboards';
import navigateScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { returnToMainMenu } from './middlewares';
import { init, navigationAdder } from './helpers';
import normalizeButtonProperties from '../../util/normalize-button-properties';
import displayOrderInfo from '../../util/display-order-info';
import clearScene from '../../util/clear-scene';

const sceneId = 'order';
const { leave } = Stage;
const order = new Scene(sceneId);

order.use(returnToMainMenu, navigateScene, invokeFunction);

order.enter(
  async (ctx: ContextMessageUpdate): Promise<any> => {
    let menuStructure = null;
    let sceneSwitched = false;
    if (!ctx.session.order) {
      // Removing messages from previous scene
      await clearScene(ctx);
      await init(ctx);
    }

    await load(ctx.session.route, ctx).then((response: string):
      | string
      | void => {
      if (JSON.parse(response).length !== 1) {
        // Switching user to a scene for choosing goods(default) if no other items are available
        ctx.botScenes.removeSceneFromMap(ctx, sceneId);
        ctx.botScenes.iAmHere(ctx, 'order_goods');
        sceneSwitched = true;
        return ctx.scene.enter('order_goods');
      }
      menuStructure = new MenuStructure(response)
        .processButtons(normalizeButtonProperties)
        .processButtons(navigationAdder, ['order_amount', 'order_additions'])
        .addBackButton(ctx);
    });
    if (sceneSwitched) return;

    if (menuStructure) {
      await displayOrderInfo(ctx);
      await displayMenu(ctx, menuStructure.menu, {
        message: ctx.i18n.t('scenes.order.welcome')
      });
    }
  }
);

export default order;
