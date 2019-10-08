import { OrderItem } from 'order';

export default function composeOrderData(): void {
  const result: { [key: string]: any } = {};
  const menu = this.menu;
  for (let key in menu) {
    if (key !== 'description') {
      result.order[key] = menu[key];
    }
  }
  Object.assign(this.menu, result);
}
