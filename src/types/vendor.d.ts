interface Stack {
    [key: string]: StackItem;
}
interface StackItem {
    sorted: boolean;
    operations: Operation[];
}
interface Operation {
    name: string;
    callback: Function;
    order?: number;
}
interface NavigationCallbackData {
    scene?: string;
}
interface FunctionInvokingCallbackData {
    cb: string;
    args: string;
}
interface Menu {
    title: string;
    data: NavigationCallbackData|FunctionInvokingCallbackData;
}