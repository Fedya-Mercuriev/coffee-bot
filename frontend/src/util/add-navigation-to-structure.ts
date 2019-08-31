/**
 Adds links to scenes from the provided array depending on value of a desired property
 * @param callback - a passed callback function that adds scenes
 * @param items - an object of assumed menu items
 * @param scenes - an array of scenes (next(the scene that can be skipped) and the one after the next scene)
 * */
export default async function addNavigationToStructure(
  callback: Function,
  items: any,
  scenes: string[]
): Promise<any> {
  let result: any = {};
  const args = Array.prototype.slice.call(arguments, 1);

  result = callback.apply(this, args);
  return result;
}
