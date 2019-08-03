interface OrderObject {
    [key: string]: any;
    title: string;
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