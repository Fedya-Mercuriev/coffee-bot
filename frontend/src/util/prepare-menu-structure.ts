import _ from 'lodash';
import { EnumerableObject } from 'vendor';
import MenuButton from 'menu-button';

export default class MenuStructure {
  private menuItems: MenuButton[][] | MenuButton[];
  public constructor(json: any) {
    this.menuItems = this._prepareRows(JSON.parse(JSON.stringify(json)));
  }
  public get menu(): EnumerableObject {
    return this.menuItems;
  }
  public getMenuStructure(): EnumerableObject {
    return this.menuItems;
  }
  private _prepareRows(menuDataObject: { [key: string]: any }): any[] {
    let result: any[] = [];
    Object.keys(menuDataObject).forEach(item => {
      const currentMenuItem = menuDataObject[item];
      result.push([currentMenuItem]);
    });
    return result;
  }
  public processButtons(callback: Function, ...args: any[]): this {
    this.menuItems.forEach((item: any) => {
      const cbArgs: any[] = [item].concat(args);
      callback(...cbArgs);
    });
    return this;
  }
}
