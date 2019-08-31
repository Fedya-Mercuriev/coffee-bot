import { Markup, ContextMessageUpdate, CallbackButton } from 'telegraf';
import { EnumerableObject } from 'vendor';
import generateRandomString from './generate-random-string';
import extractProps from './extract-props-from-object';
import _ from 'lodash';

function composeCallbackData(ctx: ContextMessageUpdate, items: any): any {
  /*
     Object accessor is used to get an object with all necessary data
     Unfortunately telegram only allows 64-bit data, that's why have to
     store object in a separate property
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
          extractProps(items[key], data);
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
export function buildMenu(
  ctx: ContextMessageUpdate,
  options: EnumerableObject
): any {
  let result: CallbackButton[][] = [];

  for (let item in options) {
    if (options.hasOwnProperty(item)) {
      const name: string = options[item].name.replace(
        options[item].name.charAt(0),
        options[item].name.charAt(0).toUpperCase()
      );
      const data: any = composeCallbackData(ctx, options[item]);

      result.push([Markup.callbackButton(name, data)]);
    }
  }

  return Markup.inlineKeyboard(result);
}

export async function addBackButton(
  ctx: ContextMessageUpdate
): Promise<EnumerableObject> {
  const previousScene = await ctx.botScenes.previousScene(ctx);

  return Object.assign(this.menu, {
    back: {
      name: ctx.i18n.t('buttons.back'),
      data: {
        scene: previousScene
      }
    }
  });
}
