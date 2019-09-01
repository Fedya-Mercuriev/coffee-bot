import _ from 'lodash';
import { EnumerableObject } from 'vendor';

export default function extractProps(obj: EnumerableObject): EnumerableObject {
  let result: EnumerableObject = {};
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) return;
    if (_.isPlainObject(obj[key])) {
      result[key] = extractProps(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}
