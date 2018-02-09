export interface IBoost {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
    extraData: string;
}

export interface IUserBoost extends IBoost {
    active: number;
    quantity: number;
    start: number;
    timer: number;
}
