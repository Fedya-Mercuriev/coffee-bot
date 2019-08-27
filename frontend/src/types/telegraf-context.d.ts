import { I18n } from 'telegraf-i18n';
import { BotContext, SessionStorage } from './vendor';

declare module 'telegraf' {
  interface ContextMessageUpdate {
    i18n: I18n;
    scene: any;
    botScenes: BotContext;
    session: SessionStorage;
  }
}
