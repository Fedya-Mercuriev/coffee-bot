import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import navigateToScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { displayMenu } from '../../util/keyboards';
import MenuStructure from '../../util/prepare-menu-structure';

const sceneId = 'contacts';
const { Leave } = Stage;
const contacts = new Scene(sceneId);

contacts.use(navigateToScene, invokeFunction);

contacts.enter(async (ctx: ContextMessageUpdate) => {
  const menuStructure = new MenuStructure('').addBackButton(ctx);
  await displayMenu(ctx, menuStructure.menu, {
    message: ctx.i18n.t('scenes.contacts.content')
  });
});

export default contacts;
