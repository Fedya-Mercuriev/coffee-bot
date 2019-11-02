import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import { ReturnedMessage } from 'vendor';
import { Good } from 'good';
import { GoodVolume } from 'good-volume';
import { Additive } from 'additive';
import clearScene from '../../util/clear-scene';
import generateRandomString from '../../util/generate-random-string';
import { OrderItem } from 'order';

// Adds a cell where info about current order will be stored
export function addOrderItem(ctx: ContextMessageUpdate): void {
  ctx.session.currentOrderId = generateRandomString(10);
  ctx.session.order.items.set(ctx.session.currentOrderId, {
    good: {},
    volume: {},
    additives: {}
  });
}

/**
 * Adds all necessary properties to session when order is started
 * @param ctx - context message update object
 * */
export async function init<T>(ctx: ContextMessageUpdate): Promise<boolean> {
  ctx.session.order = {
    getOrderItem(type: string, id?: string): OrderItem {
      return this.items.get(id ? id : ctx.session.currentOrderId)[type];
    },
    items: null
  };
  ctx.session.order.items = new Map();
  ctx.session.currentOrderId = null;
  ctx.session.orderInfoMsg = `* ${ctx.i18n.t(
    'scenes.order.orderInfoContent'
  )} *`;
  if (!ctx.session.order.items.size) {
    addOrderItem(ctx);
  }
  return true;
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
 * @param item - a current menu structure item
 * @param customSceneName - a static name for a scene of an item
 * */
export function navigationAdder(
  item: any,
  customSceneName: string
): { [key: string]: any; scene: string } {
  if (customSceneName) {
    return Object.assign(item, { scene: customSceneName });
  }
  return Object.assign(item, { scene: 'order_' + item.name });
  /*let result: any = {};
  Object.keys(items).forEach((item: string) => {
    let productObject: ProductObject = {
      name: null,
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

      productObject.name = name;
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
  if (!this.structure) return;
  this.structure = result;*/
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
    ctx.session.messages.storage = {
      key: 'orderInfo',
      message: editedMessage
    };
  }
}

export async function composeOrderInfoMessage(
  ctx: ContextMessageUpdate
): Promise<string> {
  let messageContent = `${ctx.i18n.t('scenes.order.orderInfoMsg')}:\n`;
  let good: Good = ctx.session.order.items.get(ctx.session.currentOrderId).good;
  let volume: GoodVolume = ctx.session.order.items.get(ctx.session.currentOrderId).volume;
  // let additives: Additive[] = ctx.session.order.items.get(ctx.session.currentOrderId).additives;
  let price: number = ctx.session.order.price;

  if (good) {
    messageContent += `<b>${_.startCase(good.name)}</b>`;
    if (typeof volume === 'object' && !_.every(volume, _.isNull)) {
      messageContent += `(${volume.name})`;
    }
    messageContent += '\n';
  }

  // Composing additions list
  /*if (_.isArray(additives) && additives.length) {
    let additionsString = '';

    // Adding a title for section
    messageContent += `<b>${ctx.i18n.t('orderItems.additions')}</b>\n`;
    additionsString = getAdditionsString(additives);
    messageContent += additionsString;
  }*/

  if (price) {
    messageContent += `${ctx.i18n.t('scenes.order.totalPrice')}: ${price}₽`;
  }
  return messageContent;
}
