import { ContextMessageUpdate } from 'telegraf';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import navigateScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { updateOrderInfo } from '../order/middlewares';
import dummy from './dummy.json';
import { addNavigationToStructure } from "../order/helpers";
import { navigationAdder } from '../order_amount/helpers';
import { buildMenu, addBackButton } from "../../util/keyboards";

const sceneId = 'order_additions';
const { leave } = Stage;
const additions = new Scene(sceneId);

additions.use(
    updateOrderInfo,
    navigateScene,
    invokeFunction
);

additions.enter(async (ctx: ContextMessageUpdate) => {
    // const structure = JSON.parse(JSON.stringify(dummy));
    // let menu = await addNavigationToStructure(navigationAdder, structure[ctx.session.order.item], ['order_additions']);
    let menu = await addBackButton(ctx, {});

    await ctx.editMessageText('Мы в сцене выбора добавок', buildMenu(ctx, menu).extra());
});

export default additions;