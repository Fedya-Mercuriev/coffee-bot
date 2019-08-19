import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import { buildMenu, addBackButton } from "../../util/keyboards";
import navigateScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { updateOrderInfo, returnToMainMenu } from './middlewares';
import { init, addNavigationToStructure, navigationAdder } from './helpers';
import displayOrderInfo from '../../util/display-order-info';
import clearScene from '../../util/clear-scene';
import dummy from './dummy.json';

const sceneId = 'order';
const { leave } = Stage;
const order = new Scene(sceneId);

order.use(
    returnToMainMenu,
    updateOrderInfo,
    navigateScene,
    invokeFunction
);

order.enter(async (ctx: ContextMessageUpdate) => {

    // Process response and add links to scenes depending on whether a drink has different amounts or none
    let menu = await addNavigationToStructure(navigationAdder, dummy, ['order_amount', 'order_additions']);
    menu = await addBackButton(ctx, menu);

    if (!ctx.session.order) {
        // Removing messages from previous scene
        await clearScene(ctx);

        init(ctx);
        const { message_id } = await displayOrderInfo(ctx);
        ctx.session.messages.storage = {
            key: 'orderInfo',
            message_id
        };
        await ctx.reply(ctx.i18n.t('scenes.order.welcome'), buildMenu(ctx, menu).extra());
    } else {
        await ctx.editMessageText(ctx.i18n.t('scenes.order.welcome'), buildMenu(ctx, menu).extra());
    }
});

export default order;