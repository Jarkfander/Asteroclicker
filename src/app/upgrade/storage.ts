import { Upgrade } from './upgrade';

export class Storage extends Upgrade {

    public capacity: number;

    constructor(level: number, cost: number, capacity: number) {
        super(level, cost);
        this.capacity = capacity;
    }
}
