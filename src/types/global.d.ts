interface NavigationCallbackData {
    scene?: string;
}

interface FunctionInvokingCallbackData {
    cb: string;
    args: string;
}

declare interface Menu {
    title: string;
    data: NavigationCallbackData|FunctionInvokingCallbackData;
}