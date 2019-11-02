import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import navigateToScene from '../../middlewares/navigate-scene';
import MenuStructure from '../../util/prepare-menu-structure';
import { displayMenu } from '../../util/keyboards';

const sceneId = 'about';
const { Leave } = Stage;
const about = new Scene(sceneId);

about.use(navigateToScene);

about.enter(async (ctx: ContextMessageUpdate) => {
  const menuStructure = new MenuStructure(ctx, '').addBackButton(ctx);

  // ctx.session.messages.clearStorage();
  await displayMenu(ctx, menuStructure.menu, {
    message: ctx.i18n.t('scenes.about.content')
  });
});

export default about;
