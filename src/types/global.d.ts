/**
 * Defines structure for an object carrying information about each order item
 * @param title - a title for a order item
 * @param data - a data to be kept inside a callback button
 * */

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