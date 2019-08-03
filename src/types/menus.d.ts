declare interface NavigationMenuItem {
    title: string;
    data: string;
}
declare interface OrderMenuItem {
    [kry: string]: string;
    title: string;
    order: string;
    scene?: string;
}