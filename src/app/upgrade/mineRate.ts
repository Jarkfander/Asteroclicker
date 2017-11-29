import { Upgrade } from './upgrade';

export class MineRate extends Upgrade {
    public baseRate: number;
    public maxRate: number;

    constructor(level: number, cost: number, baseRate: number, maxRate: number, time: number) {
        super(level, cost, time,'mineRate',"Mining speed");
        this.cara["baseRate"]=baseRate; 
        this.cara["maxRate"]=maxRate;
        this.baseRate = baseRate;
        this.maxRate = maxRate;
    }
}
