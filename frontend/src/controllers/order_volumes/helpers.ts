import { Volume } from 'volumes';

/**
 * Processes given object and adds 'scene' property for navigating around desired scenes
 * @param items - an object of menu items in current menu
 * @param scenes - an array of scenes to be chosen a scene from
 * */
export function navigationAdder(items: any, scenes: string[]): any {
  const result: any = {};

  Object.keys(items).forEach((key: string) => {
    const menuItem = items[key];
    const menuItemObj: any = {
      title: '',
      data: {
        order: {
          amount: {}
        },
        scene: ''
      }
    };

    for (let item in menuItem) {
      if (item === 'title') {
        menuItemObj.title = menuItem[item];
      } else {
        menuItemObj.data.order[item] = menuItem[item];
      }
    }
    menuItemObj.data.scene = scenes[0];
    result[key] = menuItemObj;
  });
  return result;
}

/**
 * Gets data from teh response object and composes a button data, that includes volume title, amount and price
 **/

export function composeGoodVolumeData(button: Volume) {

}
