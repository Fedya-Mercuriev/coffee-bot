import { ContextMessageUpdate } from 'telegraf';
import { GoodVolume } from 'good-volume';
import { Volume } from 'volumes';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import navigateScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import updateOrderInfo from '../../middlewares/update-order-info';
import { composeButtonTitle } from './helpers';
import load from '../../util/load';
import MenuStructure from '../../util/prepare-menu-structure';
import { displayMenu } from '../../util/keyboards';

const sceneId = 'order_good_volume';
const { leave } = Stage;
const amount = new Scene(sceneId);

amount.use(updateOrderInfo, navigateScene, invokeFunction);

/*{
  "volume_id": 1,
  "volume": "S",
  "unit_of_measure": "300"
}*/

amount.enter(async (ctx: ContextMessageUpdate) => {
  let menuStructure;
  let volumes: Volume[];
  await load(`${process.env.API_DOMAIN}/api/volumes/`, ctx).then(
    (response: string) => {
      volumes = JSON.parse(response);
    }
  );
  await load(ctx.session.route, ctx).then(response => {
    menuStructure = new MenuStructure(ctx, response)
      .processButtons(composeButtonTitle, volumes)
      .addBackButton(ctx);
  });
  await displayMenu(ctx, menuStructure.menu, {
    message: ctx.i18n.t('scenes.amount.welcome')
  });
});

export default amount;
