require('dotenv').config();
import path from 'path';
import Telegraf, { ContextMessageUpdate, Extra, Markup } from 'telegraf';
import TelegrafI18n, { match } from 'telegraf-i18n';
import { ScenesMapItem } from 'vendor';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import start from './controllers/start';
import cart from './controllers/cart';
import contacts from './controllers/contacts';
import about from './controllers/about';
import order from './controllers/order';
import goods from './controllers/order_goods';
import amount from './controllers/order_volumes';
import additions from './controllers/order_additions';
import _ from 'lodash';

const i18n = new TelegrafI18n({
  defaultLanguage: 'ru',
  directory: path.resolve(__dirname, 'locales'),
  useSession: true,
  defaultLanguageOnMissing: true,
  sessionName: 'session'
});

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([start, cart, contacts, about, order, goods, amount]);

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
    const sceneIndex = _.findIndex(
      ctx.session.scenesMap,
      item => item.name === sceneName
    );
    let sceneObj: { name: string; url?: string } = {
      name: sceneName
    };
    sceneObj = ctx.session.route
      ? Object.assign(sceneObj, { url: ctx.session.route })
      : sceneObj;

    if (_.findIndex(ctx.session.scenesMap, sceneObj) === -1) {
      ctx.session.scenesMap.push(sceneObj);
    } else {
      ctx.session.scenesMap = sceneIndex
        ? ctx.session.scenesMap.slice(0, sceneIndex + 1)
        : [ctx.session.scenesMap[0]];
    }
  },
  /**
   * Returns name of a previous scene in a map
   * @param ctx - Message update object
   * */
  previousScene: (ctx: ContextMessageUpdate): string => {
    if (ctx.session.scenesMap.length > 1) {
      return ctx.session.scenesMap[ctx.session.scenesMap.length - 2].name;
    } else {
      return ctx.session.scenesMap[0].name;
    }
  },
  currentScene: (ctx: ContextMessageUpdate): ScenesMapItem => {
    return ctx.session.scenesMap[ctx.session.scenesMap.length - 1];
  },
  removeSceneFromMap: (ctx: ContextMessageUpdate, sceneName: string): void => {
    const sceneIndex = _.findIndex(
      ctx.session.scenesMap,
      item => item.name === sceneName
    );
    if (sceneIndex === -1) {
      console.error(`Нет объекта сцены с названием '${sceneName}'`);
      return;
    }
    ctx.session.scenesMap.splice(sceneIndex, 1);
  }
};

bot.start(async (ctx: ContextMessageUpdate) => {
  await ctx.scene.enter('start');
});

bot.stop();

bot.launch();
