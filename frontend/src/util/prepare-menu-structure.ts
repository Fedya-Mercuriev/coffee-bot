import _ from 'lodash';
import MenuButton from 'menu-button';
import { ContextMessageUpdate } from 'telegraf';

export default class MenuStructure {
  public menuItems: MenuButton[][] | MenuButton[];
  public constructor(data: any) {
    this.menuItems = this._prepareRows(JSON.parse(data));
  }
  public get menu(): MenuButton[][] | MenuButton[] {
    return this.menuItems;
  }
  private _prepareRows(menuData: { [key: string]: any } | any[]): any[] {
    let result: any[] = [];
    if (!Array.isArray(menuData)) {
      menuData = _.values(menuData);
    }
    menuData.forEach((item: object) => {
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
      .then((previousScene: string) => {
        this.menuItems.push([
          {
            name: ctx.i18n.t('buttons.back'),
            data: {
              scene: previousScene
            }
          }
        ]);
      })
      .catch((e) => {
        console.log(e);
      });
    return this;
  }
}
