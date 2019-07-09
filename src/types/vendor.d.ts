interface SessionStorage {
    started: boolean;
    sceneMessages: number[];
    scenesMap: string[];
    order: object;
    orderInfoMsg: any;
    menu: object;
}

interface BotContext {
    iAmHere: Function;
    previousScene: Function;
    collectMsg: any;
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
interface Menu {
    title: string;
    data: NavigationCallbackData|FunctionInvokingCallbackData;
}