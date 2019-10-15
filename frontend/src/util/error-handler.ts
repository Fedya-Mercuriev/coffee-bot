import { ContextMessageUpdate } from 'telegraf';
import MenuStructure from './prepare-menu-structure';
import { buildMenu } from './keyboards';
import deleteMessage from './delete-messages';

/**
 * Displays error as a message text
 * @param options - an object of arguments to be passed:
 * ctx - context message update object
 * errorMsg - text to be displayed in message
 * callback - function name to be invoked on callback button click
 * args - an array of arguments to be passed to the function
 */
export async function displayError(options: {
  ctx: ContextMessageUpdate;
  errorMsg: string;
  callback?: string;
  args?: any[];
}) {
  const { ctx, errorMsg, callback, args } = options;
  let menuStructure: any = {
    name: ctx.i18n.t('buttons.try_again'),
    data: {
      cb: {
        name: callback,
        args: args
      }
    }
  };
  menuStructure = new MenuStructure(menuStructure);
  // Edit message text if error message was sent before
  if (ctx.session.messages.hasMessage('error')) {
    try {
      ctx.session.messages.storage = {
        key: 'error',
        message: await ctx.editMessageText(
          `🚫 ${errorMsg}`,
          callback ? buildMenu(ctx, menuStructure.menu).extra() : null
        )
      };
    } catch (e) {
      console.log(e.message);
    }
    return;
  } else {
    ctx.session.messages.storage = {
      key: 'error',
      message: await ctx.reply(
        `🚫 ${errorMsg}`,
        callback ? buildMenu(ctx, menuStructure.menu).extra() : null
      )
    };
  }
}

export async function hideError(ctx: ContextMessageUpdate) {
  const messageKey: string = ctx.session.messages.getMessage('error');
  if (messageKey) {
    await deleteMessage(ctx, messageKey);
    ctx.session.messages.deleteMessage(messageKey);
  }
}
