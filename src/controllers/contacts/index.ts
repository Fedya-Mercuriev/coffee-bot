import { ContextMessageUpdate } from "telegraf";
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import navigateToScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { buildMenu } from '../../util/keyboards'

const sceneId = 'contacts';
const { Leave } = Stage;
const contacts = new Scene(sceneId);

contacts.use(
    navigateToScene,
    invokeFunction
);

contacts.enter(async (ctx: ContextMessageUpdate) => {
    const menuStructure = {
        back: {
            title: ctx.i18n.t('buttons.back'),
            data: {
                scene: await ctx.botScenes.previousScene(ctx)
            }
        }
    };
    ctx.session.messages.clearStorage();
    await ctx.editMessageText(ctx.i18n.t('scenes.contacts.content'), buildMenu(menuStructure).extra());
});

export default contacts;