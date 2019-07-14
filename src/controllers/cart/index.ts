import { ContextMessageUpdate } from "telegraf";
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import navigateToScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { buildMenu } from '../../util/keyboards'

const sceneId = 'cart';
const { Leave } = Stage;
const cart = new Scene(sceneId);

cart.use(
    navigateToScene,
    invokeFunction
);

cart.enter(async (ctx: ContextMessageUpdate) => {
    const menuStructure = {
        back: {
            title: ctx.i18n.t('buttons.back'),
            data: {
                scene: await ctx.botScenes.previousScene(ctx)
            }
        }
    };
    ctx.session.messages.clearStorage();
    await ctx.editMessageText(ctx.i18n.t('scenes.cart.content'), buildMenu(menuStructure).extra());
});

export default cart;