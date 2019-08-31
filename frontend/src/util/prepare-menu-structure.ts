import { EnumerableObject } from 'vendor';

export default class MenuStructure {
  private structure: EnumerableObject;
  constructor(json: any) {
    this.structure = JSON.parse(JSON.stringify(json));
  }
  get menu(): EnumerableObject {
    return this.structure;
  }
  processStructure(callback: Function, ...args: any[]): this {
    callback.apply(this, args);
    return this;
  }
}
