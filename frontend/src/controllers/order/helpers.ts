import { ContextMessageUpdate } from 'telegraf';
import { ReturnedMessage } from 'vendor';
import { ProductObject } from 'product-object';
import { GoodVolume } from 'good-volume';
import { Good } from 'good';
import { Additive } from 'additive';
import _ from 'lodash';
import clearScene from '../../util/clear-scene';
import generateRandomString from '../../util/generate-random-string';

/**
 * Adds all necessary properties to session when order is started
 * @param ctx - context message update object
 * */
export function init(ctx: ContextMessageUpdate): void {
  ctx.session.order = {
    items: null
  };
  ctx.session.order.items = new Map();
  ctx.session.currentOrderKey = null;
  ctx.session.orderInfoMsg = `* ${ctx.i18n.t(
    'scenes.order.orderInfoContent'
  )} *`;
}
// Adds a cell ehere info about current order will be stored
export async function addOrderItem(ctx: ContextMessageUpdate): Promise<any> {
  const itemKey = generateRandomString(10);
  ctx.session.currentOrderKey = itemKey;
  ctx.session.order.items.set(ctx.session.currentOrderKey, {
    good: null,
    volume: null,
    additives: null
  });
}

/**
 Adds links to scenes from the provided array depending on value of a desired property
 * @param callback - a passed callback function that adds scenes
 * @param items - an object of assumed menu items
 * @param scenes - an array of scenes (next(the scene that can be skipped) and the one after the next scene)
* */
export async function addNavigationToStructure(
  callback: Function,
  items: any,
  scenes: string[]
): Promise<any> {
  let result: any = {};
  const args = Array.prototype.slice.call(arguments, 1);

  result = callback.apply(this, args);
  return result;
}

/**
 * Returns a list with a string type from the chosen additions
 * @param additions - an array of chosen additions
 * */
export function getAdditionsString(additions: any): string {
  let result = '';
  //TODO Сделать функцию, выдающую строку с списком добавок и их количеством
  return result;
}

/**
 * Deletes an object with properties necessary for order processing
 * @param ctx - context message update object
 * */
export async function finish(ctx: ContextMessageUpdate): Promise<void> {
  delete ctx.session.order;
  await clearScene(ctx);
  ctx.session.messages.clearStorage();
}

/**
 * Processes given object and adds 'scene' property for navigating around desired scenes
 * @param items - an object of menu items in current menu
 * @param scenes - an array of scenes to be chosen a scene from
 * */
export function navigationAdder(items: any, scenes: string[]) {
  let result: any = {};
  Object.keys(items).forEach((item: string) => {
    let productObject: ProductObject = {
      data: {
        order: {
          name: null,
          description: null,
          volume: null,
          price: null,
          good_type_id: null
        },
        scene: null
      }
    };

    for (let key in items[item]) {
      const { name, description, volume, price, good_type_id } = items[item];

      productObject.data.order.name = name;
      productObject.data.order.description = description;
      productObject.data.order.price = price;
      productObject.data.order.good_type_id = good_type_id;

      if (volume) {
        productObject.data.scene = scenes[0];
      } else {
        productObject.data.scene = scenes[1];
      }
    }
    result[item] = productObject;
  });
  return result;
}

/**
 * @param ctx - Context message update object
 * @param orderInfo - an object containing updated orderInfo
 * */
export async function updateOrderInfoMsg(
  ctx: ContextMessageUpdate,
  orderInfo: string
) {
  let editedMessage: ReturnedMessage | boolean = null;

  try {
    editedMessage = await ctx.telegram.editMessageText(
      ctx.chat.id,
      ctx.session.messages.storage.get('orderInfo'),
      null,
      orderInfo,
      { parse_mode: 'HTML' }
    );
  } catch (e) {
    return;
  }
  if (!_.isBoolean(editedMessage)) {
    const { message_id } = editedMessage;
    ctx.session.messages.storage = {
      key: 'orderInfo',
      message_id
    };
  }
}

export async function composeOrderInfoMessage(
  ctx: ContextMessageUpdate
): Promise<string> {
  let messageContent = `${ctx.i18n.t('scenes.order.orderInfoMsg')}:\n`;
  let title: string = ctx.session.order.item;
  let volume: GoodVolume = ctx.session.order.amount;
  let additions: Additive[] = ctx.session.order.additions;
  let price: number = ctx.session.order.price;

  if (title) {
    messageContent += `<b>${_.startCase(title)}</b>`;
    if (typeof volume === 'object' && !_.every(volume, _.isNull)) {
      messageContent += `(${volume.name})`;
    }
    messageContent += '\n';
  }

  // Composing additions list
  if (_.isArray(additions) && additions.length) {
    let additionsString = '';

    // Adding a title for section
    messageContent += `<b>${ctx.i18n.t('orderItems.additions')}</b>\n`;
    additionsString = getAdditionsString(additions);
    messageContent += additionsString;
  }

  if (price) {
    messageContent += `${ctx.i18n.t('scenes.order.totalPrice')}: ${price}₽`;
  }
  return messageContent;
}
