import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import { buildMenu, addBackButton } from "../../util/keyboards";
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
    function callback(items:any, scenes: string[]) {
        let result:any = {};
        Object.keys(items).forEach((item:string) => {
            let productObject:any = {data: {
                    order: <OrderObject>{},
                    scene: null
                }};

            for (let key in items[item]) {
                if (key === 'title') {
                    productObject.title = items[item][key];
                } else if (key === 'amount') {
                    if (items[item][key]) {
                        productObject.data.scene = scenes[0];
                    } else {
                        productObject.data.scene = scenes[1];
                    }
                } else if (key === 'scene') {
                    productObject.data.scene = items[item][key];
                } else {
                    productObject.data.order[key] = items[item][key];
                }
            }
            result[item] = productObject;
        });
        return result;
    }
    // Process response and add links to scenes depending on whether a drink has different amounts or none
    let menu = await addNavigationToStructure(callback, dummy, ['order_amount', 'order_additions']);
    menu = await addBackButton(ctx, menu);

    // Removing messages from previous scene
    await clearScene(ctx);

    if (!ctx.session.order) {
        init(ctx);
        const { message_id } = await displayOrderInfo(ctx);
        ctx.session.messages.storage = {
            key: 'orderInfo',
            message_id
        };
        await ctx.reply(ctx.i18n.t('scenes.order.welcome'), buildMenu(ctx, menu).extra());
    } else {
        const { message_id } = await displayOrderInfo(ctx);
        ctx.session.messages.storage = {
            key: 'orderInfo',
            message_id
        };
        await ctx.editMessageText(ctx.i18n.t('scenes.order.welcome'), buildMenu(ctx, menu).extra());
    }
});

order.action('back', (ctx: ContextMessageUpdate) => {
    if (_.some(ctx.session.order, _.isEmpty)) {
        finish(ctx);
    }
    ctx.session.currentMenu.clear();
});

export default order;