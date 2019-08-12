require('dotenv').config();
import path from 'path';
import Telegraf, { ContextMessageUpdate, Extra, Markup } from 'telegraf';
import TelegrafI18n, { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import start from './controllers/start/index';
import cart from './controllers/cart/index';
import contacts from './controllers/contacts/index';
import about from './controllers/about/index';
import order from './controllers/order/index';
import amount from './controllers/order_amount/index';

const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    defaultLanguageOnMissing: true,
    sessionName: 'session'
});

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([
    start,
    cart,
    contacts,
    about,
    order,
    amount
]);

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());

// Adding functions to process scenes
bot.context.botScenes = {
    /**
     * Tells bot where user is and either adds scene to map or removes it
     * @param ctx - Message update object
     * @param sceneName - Name of the current scene
    * */
    iAmHere: (ctx: ContextMessageUpdate, sceneName: string): void => {
        const sceneIndex = ctx.session.scenesMap.indexOf(sceneName);

        if (ctx.session.scenesMap.indexOf(sceneName) === -1) {
          ctx.session.scenesMap.push(sceneName);
        } else {
          ctx.session.scenesMap = (sceneIndex) ? ctx.session.scenesMap.slice(0, sceneIndex) : [ctx.session.scenesMap[0]];
        }
    },
    /**
    * Returns name of a previous scene in a map
    * @param ctx - Message update object
    * */
    previousScene: async (ctx: ContextMessageUpdate): Promise<string> => {
        return ctx.session.scenesMap[ctx.session.scenesMap.length - 2]
    }
};

bot.start(async (ctx: ContextMessageUpdate) => {
    await ctx.scene.enter('start');
});

bot.stop();

bot.launch();