import _ from 'lodash';
import { GoodType } from 'good-type';
import { Good } from 'good';
import { GoodVolume } from 'good-volume';

/**
 * Accepts a button and assigns an objects that contains all data necessary for order update on current step
 * @param button - currently iterated button object
 * @param options - an object of additional parameters (type - a type of item (good, volume, additive),
 * stripKeys - an array (or string) of keys to include into result object)
 */

export default function composeOrderData<
  T extends GoodType | Good | GoodVolume
>(button: T, options: { type: string; stripKeys?: string | string[] }): T {
  const orderObj: any = {};
  let keysToExclude = ['name', 'description', 'url', 'scene', 'cb'];
  const { type, stripKeys } = options;

  orderObj.type = type;

  if (stripKeys) {
    if (!Array.isArray(stripKeys)) {
      keysToExclude = _.without(keysToExclude, stripKeys);
    } else {
      keysToExclude = _.without(keysToExclude, ...stripKeys);
    }
  }

  for (let key in button) {
    if (button.hasOwnProperty(key)) {
      if (keysToExclude.indexOf(key) === -1) {
        orderObj[key] = button[key];
      }
    }
  }
  return Object.assign(button, { order: orderObj });
}
