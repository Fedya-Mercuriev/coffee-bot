import { Good } from './good';
import { Additive } from './additive';
import { GoodVolume } from './good-volume';

interface OrderObject {
  [key: string]: any;
  items: Map<string, OrderItem>;
  getOrderItem: Function;
}
interface OrderItem {
  [key: string]: any;
  good: Good;
  volume: GoodVolume;
  additives: Map<string, { item: Additive; quantity: number }>;
}
