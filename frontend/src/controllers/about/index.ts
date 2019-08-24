import { ContextMessageUpdate } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import navigateToScene from '../../middlewares/navigate-scene';
// import invokeFunction from '../../middlewares/invoke-function';
import { buildMenu } from '../../util/keyboards'

const sceneId = 'about';
const { Leave } = Stage;
const about = new Scene(sceneId);

about.use(
    navigateToScene,
    // invokeFunction
);

about.enter(async (ctx: ContextMessageUpdate) => {
    const menuStructure = {
        back: {
            title: ctx.i18n.t('buttons.back'),
            data: {
                scene: await ctx.botScenes.previousScene(ctx)
            }
        }
    };

    ctx.session.messages.clearStorage();
    await ctx.editMessageText(ctx.i18n.t('scenes.about.content'), buildMenu(ctx, menuStructure).extra());
});

export default about;