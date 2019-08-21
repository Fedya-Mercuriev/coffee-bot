import { I18n } from 'src/types/telegraf-i18n';

declare module 'telegraf' {
    interface ContextMessageUpdate {
        i18n: I18n;
        scene: any;
        botScenes: BotContext;
        session: SessionStorage;
    }
}