require('dotenv').config();
import path from 'path';
import Telegraf, { ContextMessageUpdate, Extra, Markup } from 'telegraf';
import TelegrafI18n, { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import start from './controllers/start';
import about from './controllers/about/index';
import order from './controllers/order/index';

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
    about,
    order
]);

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());

// Adding functions to process scenes
bot.context.scenes = {
    /**
     * @param ctx - Message update object
     * @param sceneName - Name of the current scene
    * */
    addScene: (ctx: ContextMessageUpdate, sceneName: string): void => {
      ctx.session.scenesMap.push(sceneName);
    },
    // Returns name of a previous scene in a map
    previousScene: (ctx: ContextMessageUpdate): string => {
        return ctx.session.scenesMap[ctx.session.scenesMap.length - 2]
    }
};

bot.start(async (ctx: ContextMessageUpdate) => {
    await ctx.scene.enter('start');
});

bot.stop();

bot.launch();