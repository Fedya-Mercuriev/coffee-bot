import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import { buildOrderMenu } from "../../util/keyboards";
import navigateScene from '../../middlewares/navigate-scene';
import invokeFunction from '../../middlewares/invoke-function';
import { updateOrderInfo } from './middlewares';
import { init, finish, addNavigationToStructure } from './helpers';
import displayOrderInfo from '../../util/display-order-info';
import clearScene from '../../util/clear-scene';
import dummy from './dummy.json';

const sceneId = 'order';
const { leave } = Stage;
const order = new Scene(sceneId);

order.use(
    updateOrderInfo,
    navigateScene,
    invokeFunction
);

order.enter(async (ctx: ContextMessageUpdate) => {
    // Process response and add links to scenes depending on whether a drink has different amounts or none
    const menu = await addNavigationToStructure(dummy, ['order_amount', 'order_additions']);

    // Removing messages from previous scene
    await clearScene(ctx);

    if (!ctx.session.order) {
        init(ctx);
        const { message_id } = await displayOrderInfo(ctx);
        ctx.session.messages.storage = {
            key: 'orderInfo',
            message_id
        };
        await ctx.reply(ctx.i18n.t('scenes.order.welcome'), buildOrderMenu(ctx, menu).extra());
    } else {
        const { message_id } = await displayOrderInfo(ctx);
        ctx.session.messages.storage = {
            key: 'orderInfo',
            message_id
        };
        await ctx.editMessageText(ctx.i18n.t('scenes.order.welcome'), buildOrderMenu(ctx, menu).extra());
    }
});

order.leave((ctx: ContextMessageUpdate) => {
   if (_.some(ctx.session.order, _.isEmpty)) {
       finish(ctx);
   }
   ctx.session.currentMenu.clear();
});

export default order;