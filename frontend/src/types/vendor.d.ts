import { OrderObject } from './order';
import { ReturnedMessage } from 'vendor';

declare module 'vendor' {
  interface EnumerableObject {
    [key: string]: any;
  }

  interface ReturnedMessage {
    [key: string]: any;
  }
  interface CustomMessage {
    [key: string]: string | ReturnedMessage;
    key: string;
    message: ReturnedMessage;
  }
  interface SessionStorage {
    [key: string]: any;
    started: boolean;
    messages: any;
    scenesMap: ScenesMapItem[];
    order: OrderObject;
    currentOrderKey: string;
    orderInfoMsg: string;
    menu: object;
    router: Router;
    isAdmin: boolean;
    token: string;
  }
  interface Router {
    _route: string;
    route: string;
    getRoute: Function;
  }
  interface ScenesMapItem {
    name: string;
    url?: string;
  }
  interface BotContext {
    iAmHere: Function;
    previousScene: Function;
    currentScene: Function;
    removeSceneFromMap: Function;
  }
  interface Operation {
    name: string;
    callback: Function;
    order?: number;
  }
  interface NavigationCallbackData {
    scene: string;
  }
  interface FunctionInvokingCallbackData {
    cb: string;
    args: string;
  }
  interface Menu<T> {
    title: string;
    data: T;
  }

  interface OrderMenuItem {
    title: string;
    order: string;
    scene?: string;
  }
}
