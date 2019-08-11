import { ContextMessageUpdate } from 'telegraf';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import navigateScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { updateOrderInfo } from '../order/middlewares';
import dummy from './dummy.json';
import { addNavigationToStructure } from "../order/helpers";
import { navigationAdder } from './helpers';
import { buildMenu, addBackButton } from "../../util/keyboards";

const sceneId = 'order_amount';
const { leave } = Stage;
const amount = new Scene(sceneId);

amount.use(
    updateOrderInfo,
    navigateScene,
    invokeFunction
);

amount.enter(async (ctx: ContextMessageUpdate) => {
    const structure = JSON.parse(JSON.stringify(dummy));
    let menu = await addNavigationToStructure(navigationAdder, structure[ctx.session.order.item], ['order_additions']);
    menu = await addBackButton(ctx, menu);

    await ctx.editMessageText(ctx.i18n.t('scenes.amount.welcome'), buildMenu(ctx, menu).extra());
});

export default amount;