import { ContextMessageUpdate } from 'telegraf';
import { ReturnedMessage, CustomMessage } from 'vendor';
import createRouter from './router';
import generateRandomString from './generate-random-string';

export default async function initializeApp(
  ctx: ContextMessageUpdate
): Promise<void> {
  ctx.session.started = true;
  ctx.session.messages = {
    _messages: new Map(),
    get storage() {
      return this._messages;
    },
    set storage(messageObj: ReturnedMessage | CustomMessage) {
      if (typeof messageObj !== 'boolean') {
        if (!messageObj.key) {
          const { message_id } = messageObj;
          let key = generateRandomString(15, this._messages);

          this._messages.set(key, message_id);
          // This block of code gets executed when a object with a desired key and message id is provided
        } else {
          const { key, message } = messageObj;
          const { message_id } = message;
          this._messages.set(key, message_id);
        }
      } else {
        return;
      }
    },
    getMessage(key: string): string {
      if (this._messages.has(key)) {
        return this._messages.get(key);
      }
      console.error(`Нет сообщения с ключом '${key}'`);
    },
    hasMessage(key: string): boolean {
      return this._messages.has(key);
    },
    hasMessages() {
      return this._messages.size > 0;
    },
    delete(key: string) {
      this.messages.delete(key);
    },
    deleteMessage(key: string) {
      try {
        ctx.deleteMessage(ctx.session.messages.getMessage(key));
        this._messages.delete(key);
      } catch (e) {
        console.error(`Нет сообщения с ключом '${key}'`);
      }
    },
    isNotEmpty(): boolean {
      return this._messages.size > 0;
    },
    clearStorage() {
      this._messages.clear();
    }
  };
  ctx.session.scenesMap = [];
  ctx.session.currentMenu = new Map();
  ctx.session.isAdmin = false;
  ctx.session.token = null;
  createRouter(ctx);
}
