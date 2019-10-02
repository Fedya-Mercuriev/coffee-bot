import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import MenuStructure from '../../util/prepare-menu-structure';
import load from '../../util/load';
import { buildMenu } from '../../util/keyboards';
import navigateScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import normalizeButtonProperties from '../../util/normalize-button-properties';
import { updateOrderInfo } from './middlewares';

const sceneId = 'order_goods';
const { leave } = Stage;
const goods = new Scene(sceneId);

goods.use(updateOrderInfo, navigateScene, invokeFunction);

goods.enter(
  async (ctx: ContextMessageUpdate): Promise<any> => {
    let menuStructure = null;
    console.log(ctx.session.currentRoute());
    await ctx.reply('Заказываем кофан!');
  }
);

export default goods;
