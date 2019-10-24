import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import MenuStructure from '../../util/prepare-menu-structure';
import load from '../../util/load';
import { buildMenu } from '../../util/keyboards';
import navigateScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { updateOrderInfo } from './middlewares';
import { GoodVolume } from 'good-volume';
import navigationAdder from './helpers';
import { displayMenu } from '../../util/keyboards';

const sceneId = 'order_goods';
const { leave } = Stage;
const goods = new Scene(sceneId);

goods.use(updateOrderInfo, navigateScene, invokeFunction);

goods.enter(
  async (ctx: ContextMessageUpdate): Promise<any> => {
    let menuStructure = null;
    let goodVolumes: GoodVolume[];
    let goodTypeId: number = null;
    await load(ctx.session.route, ctx).then(
      async (response: string): Promise<string | void> => {
        menuStructure = new MenuStructure(response);
        goodTypeId = JSON.parse(response)[0].goodtype;
      }
    );
    await load(`${process.env.API_DOMAIN}/api/good_volumes/`, ctx).then(
      (response: string): void => {
        // Filter out goods of other categories
        goodVolumes = JSON.parse(response);
      }
    );
    menuStructure
      .processButtons(navigationAdder, goodVolumes, [
        'order_good_volume',
        'order_additives'
      ])
      .addBackButton(ctx);
    await displayMenu(ctx, menuStructure.menu, {
      message:
        goodTypeId === 1
          ? ctx.i18n.t('scenes.order_goods.drink')
          : ctx.i18n.t('scenes.order_goods.food')
    });
  }
);

export default goods;
