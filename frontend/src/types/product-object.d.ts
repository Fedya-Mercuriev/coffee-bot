import { Good } from 'good';
import { Additive } from 'additive';

export interface ProductObject {
  name: string;
  data: {
    order: Good | Additive;
    scene: string;
  };
}
