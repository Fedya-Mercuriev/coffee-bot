import { OrderObject } from './order';

declare module 'vendor' {
  interface EnumerableObject {
    [key: string]: any;
  }

  interface ReturnedMessage {
    [key: string]: any;
  }
  interface CustomMessage {
    [key: string]: number | string;
    key: string;
    message_id: number;
  }
  interface SessionStorage {
    [key: string]: any;
    started: boolean;
    messages: any;
    scenesMap: string[];
    order: OrderObject;
    currentOrderKey: string;
    orderInfoMsg: string;
    menu: object;
    router: {
      previous: string;
      current: string;
    };
    prevRoute: Function;
    currentRoute: Function;
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
  /*interface OrderData {
      order: {
          select: string;
          value: string;
      }
      scene: string;
  }*/
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
