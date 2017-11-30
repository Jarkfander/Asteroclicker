import { Upgrade } from './upgrade';

export class Storage extends Upgrade {

    public capacity: number;

    constructor(level: number, cost: number, capacity: number, time: number) {
        super(level, cost, time,'storage','Storage');
        this.cara["capacity"]=capacity; 
        this.capacity = capacity;
    }
}
