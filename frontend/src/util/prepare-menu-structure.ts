import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import { ScenesMapItem } from 'vendor';
import MenuButton from './menu-button';

export default class MenuStructure {
  public menuItems: MenuButton[][] | MenuButton[];
  public constructor(ctx: ContextMessageUpdate, data: any) {
    if (!data) {
      this.menuItems = [];
    } else {
      this.menuItems = this._prepareRows(
        typeof data === 'string' ? JSON.parse(data) : data
      );
    }
  }
  public get menu(): MenuButton[][] | MenuButton[] {
    this._tidyStructure();
    return this.menuItems;
  }
  private _prepareRows(menuData: { [key: string]: any } | any[]): any[] {
    let result: any[] = [];
    let menu = menuData;
    if (!Array.isArray(menuData)) {
      menu = _.values(menuData);
      if (menu.length === 2 && !menu[0].hasOwnProperty('name')) {
        menu = [
          {
            name: menu[0],
            data: menu[1]
          }
        ];
      }
    }
    menu.forEach((item: object) => {
      result.push([item]);
    });
    return result;
  }
  // Removes all the properties that aren't name, description or plain objects
  private _tidyStructure(): void {
    function _modifyButton(button: any): void {
      let keysToExclude = ['name', 'description', 'url', 'scene', 'cb', 'data'];
      for (let key in button) {
        if (button.hasOwnProperty(key) && keysToExclude.indexOf(key) === -1) {
          delete button[key];
        }
      }
    }
    this.menuItems.forEach((buttons: MenuButton[][] | MenuButton[]): void => {
      if (buttons.length > 1) {
        buttons.forEach((item, index): void => {
          _modifyButton(buttons[index]);
        });
      } else {
        _modifyButton(buttons[0]);
      }
    });
  }
  public processButtons(callback: Function, ...args: any[]): this {
    this.menuItems.forEach((buttons: any) => {
      if (buttons.length > 1) {
        buttons.forEach((button: any) => {
          const cbArgs: any[] = [button].concat(args);
          callback(...cbArgs);
        });
      } else {
        const cbArgs: any[] = [buttons[0]].concat(args);
        callback(...cbArgs);
      }
    });
    return this;
  }
  public addBackButton(ctx: ContextMessageUpdate): this {
    const previousSceneName: ScenesMapItem = ctx.botScenes.previousScene(ctx);
    const previousSceneUrl = ctx.session.router.getRoute(ctx, previousSceneName);
    let buttonObj = {
      name: ctx.i18n.t('buttons.back'),
      data: {
        scene: previousSceneName
      }
    };
    if (previousSceneUrl) {
      buttonObj = _.merge({}, buttonObj, { data: { url: previousSceneUrl } });
    }
    this.menuItems.push([buttonObj]);
    return this;
  }
}
