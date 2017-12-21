import { Upgrade } from './upgrade';

export class MineRate extends Upgrade {
    public baseRate: number;
    public maxRate: number;

    constructor(level: number, cost: number,baseRateLvl0: number, baseRate: number, maxRate: number, time: number) {
        super(level, cost, time,'mineRate',"Mining speed");
        this.cara["Rate"]=(baseRate/baseRateLvl0).toFixed(2);
        this.baseRate = baseRate;
        this.maxRate = maxRate;
    }
}
