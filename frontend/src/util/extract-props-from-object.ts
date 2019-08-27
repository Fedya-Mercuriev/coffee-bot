import _ from 'lodash';
import { EnumerableObject } from '../types/vendor';

export default function extractProps(
  obj: EnumerableObject,
  objectToAssignProps: EnumerableObject
): void {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) return;
    if (_.isPlainObject(obj[key])) {
      extractProps(obj[key], objectToAssignProps);
    } else {
      objectToAssignProps[key] = obj[key];
    }
  }
}
