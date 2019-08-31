import { Good } from 'good';
import { Additive } from 'additive';

export interface ProductObject {
  [key: string]: any;
  name: string;
  data: {
    order: Good | Additive;
    scene: string;
  };
}
