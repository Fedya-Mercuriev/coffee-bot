import { Markup, ContextMessageUpdate, CallbackButton } from 'telegraf';
import { EnumerableObject } from 'vendor';
import generateRandomString from './generate-random-string';
import extractProps from './extract-props-from-object';
import _ from 'lodash';

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
        if (_.isPlainObject(items[key])) {
          data = extractProps(items[key]);
        } else {
          data[key] = items[key];
        }
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
