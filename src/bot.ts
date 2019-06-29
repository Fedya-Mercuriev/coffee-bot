require('dotenv').config();
import fs from 'fs';
import path from 'path';
import Telegraf, { ContextMessageUpdate, Extra, Markup } from 'telegraf';
import TelegrafI18n, { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import startScene from './controllers/start';
import menuScene from './controllers/menu';
const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    defaultLanguageOnMissing: true,
    sessionName: 'session'
});

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([
    startScene,
    menuScene
]);

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());

bot.start((ctx: ContextMessageUpdate) => {
    ctx.scene.enter('start');
});

bot.startPolling();