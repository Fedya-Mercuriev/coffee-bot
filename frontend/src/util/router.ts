import { ContextMessageUpdate } from 'telegraf';
import { ScenesMapItem } from 'vendor';

/**
 * @param ctx - message update object
 * Adds an object responsible for storing and updating routes (urls for GET requests)
 */
export default function createRouter(ctx: ContextMessageUpdate): void | string {
  ctx.session.router = {
    _route: '',
    get route(): string {
      return this._route;
    },
    set route(url) {
      this._route = url;
    },
    // Takes scene name and looks for an object with such scene in scenes map
    getRoute(ctx: ContextMessageUpdate, sceneName: string): string {
      const resultArr: ScenesMapItem[] = ctx.session.scenesMap.filter(
        (item): boolean => {
          return item.name === sceneName;
        }
      );
      if (resultArr.length) {
        return resultArr[0].url;
      }
    }
  };
}
