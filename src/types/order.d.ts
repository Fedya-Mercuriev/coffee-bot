interface OrderObject {
    [key: string]: any;
    item: string;
    amount: Amount;
    price: number;
    additions: Addition[];
}
interface Amount {
    title: string;
    value: number;
}
interface Addition {
    id: number;
    title: string;
    price: number;
}