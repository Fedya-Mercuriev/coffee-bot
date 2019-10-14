import _ from 'lodash';
import { ContextMessageUpdate } from 'telegraf';
import { ScenesMapItem } from 'vendor';
import MenuButton from './menu-button';

export default class MenuStructure {
  public menuItems: MenuButton[][] | MenuButton[];
  public constructor(data: any) {
    this.menuItems = this._prepareRows(
      typeof data === 'string' ? JSON.parse(data) : data
    );
  }
  public get menu(): MenuButton[][] | MenuButton[] {
    return this.menuItems;
  }
  private _prepareRows(menuData: { [key: string]: any } | any[]): any[] {
    let result: any[] = [];
    let menu;
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
    ctx.botScenes
      .previousScene(ctx)
      .then((previousSceneObj: ScenesMapItem) => {
        this.menuItems.push([
          {
            name: ctx.i18n.t('buttons.back'),
            data: {
              scene: previousSceneObj
            }
          }
        ]);
      })
      .catch(e => {
        console.log(e);
      });
    return this;
  }
}
