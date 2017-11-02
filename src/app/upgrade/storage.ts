import { Upgrade } from './upgrade';

export class Storage extends Upgrade {

    public capacity: number;

    constructor(level: number, _cost: number, _capacity: number) {
        super(level, _cost);
        this.capacity = _capacity;
    }
}
