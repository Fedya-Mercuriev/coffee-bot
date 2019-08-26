import { Good } from 'good';
import { Additive } from 'additive';

export interface ProductObject {
  data: {
    order: Good | Additive;
    scene: string;
  };
}
