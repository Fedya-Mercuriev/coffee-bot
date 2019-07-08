interface BotContext {
    addScene: Function;
    previousScene: Function;
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