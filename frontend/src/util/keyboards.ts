import { Markup, ContextMessageUpdate, CallbackButton } from 'telegraf';
import { EnumerableObject } from 'vendor';
import generateRandomString from './generate-random-string';
import _ from 'lodash';

function composeCallbackData(ctx: ContextMessageUpdate, menuItems: any): any {
  let objectAccessor: string = generateRandomString(8);
  let data: any = {};

  for (let key in menuItems) {
    if (menuItems.hasOwnProperty(key)) {
      if (key !== 'name') {
        data[key] = menuItems[key];
      }
    }
  }
  /*
     Object accessor is used to get an object with all necessary data
     Unfortunately telegram only allows 64-bit data, that's why have to
     store object in a separate property
    * */
  while (ctx.session.currentMenu.has(objectAccessor)) {
    objectAccessor = generateRandomString(8);
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
      const data: any = composeCallbackData(ctx, options[item].data);

      result.push([Markup.callbackButton(name, data)]);
    }
  }

  return Markup.inlineKeyboard(result);
}

export async function addBackButton(
  ctx: ContextMessageUpdate,
  menu: any
): Promise<EnumerableObject> {
  const previousScene = await ctx.botScenes.previousScene(ctx);

  return Object.assign({}, menu, {
    back: {
      name: ctx.i18n.t('buttons.back'),
      data: {
        scene: previousScene
      }
    }
  });
}
