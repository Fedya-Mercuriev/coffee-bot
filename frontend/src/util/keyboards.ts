import { Markup, ContextMessageUpdate, CallbackButton } from 'telegraf';
import { EnumerableObject } from 'vendor';
import app from '../_app';
import generateRandomString from './generate-random-string';
import extractProps from './extract-props-from-object';
import { displayError } from './error-handler';

interface DisplayMenuOptions {
  message: string;
  callback?: Function;
}

function composeCallbackData(ctx: ContextMessageUpdate, items: any): string {
  /*
     Object accessor is used to get an object with all necessary data
     Unfortunately telegram only allows 64-bit data, that's why have to
     store object in a separate 'virtual' menu
  */
  const objectAccessor: string = generateRandomString(
    8,
    ctx.session.currentMenu
  );
  let data: EnumerableObject = {};

  for (let key in items) {
    if (items.hasOwnProperty(key)) {
      if (key !== 'name') {
        data[key] = items[key];
      }
      if (key === 'data') {
        data = extractProps(items[key]);
      }
    }
  }
  ctx.session.currentMenu.set(objectAccessor, data);
  return objectAccessor;
}

/**
 * @param ctx - message update object
 * @param options - an object with
 * */
export function buildMenu(ctx: ContextMessageUpdate, options: any[][]): any {
  let result: CallbackButton[][] = [];
  options.forEach(row => {
    const currentRow = row.map((button: EnumerableObject) => {
      const name: string = button.name.replace(
        button.name.charAt(0),
        button.name.charAt(0).toUpperCase()
      );
      const data: string = composeCallbackData(ctx, button);
      return Markup.callbackButton(name, data);
    });
    result.push(currentRow);
  });

  return Markup.inlineKeyboard(result);
}

export async function displayMenu(
  ctx: ContextMessageUpdate,
  menuStructure: any[][],
  options: DisplayMenuOptions
): Promise<void> {
  if (!ctx.session.messages.hasMessage('menu')) {
    let message = null;
    try {
      message = await ctx.reply(
        options.message,
        buildMenu(ctx, menuStructure).extra()
      );
      ctx.session.messages.storage = {
        key: 'menu',
        message: message
      };
    } catch (e) {
      await displayError({
        ctx: ctx,
        errorMsg: ctx.i18n.t('errors.common'),
        callback: 'displayMenu',
        args: [ctx, menuStructure, { message: options.message }]
      });
    }
  } else {
    let message = null;
    try {
      message = await ctx.editMessageText(
        options.message,
        buildMenu(ctx, menuStructure).extra()
      );
      ctx.session.messages.storage = {
        key: 'menu',
        message: message
      };
    } catch (e) {
      await displayError({
        ctx: ctx,
        errorMsg: ctx.i18n.t('errors.common'),
        callback: 'displayMenu',
        args: [ctx, menuStructure, { message: options.message }]
      });
    }
  }
}

app.bind('displayMenu', displayMenu);
