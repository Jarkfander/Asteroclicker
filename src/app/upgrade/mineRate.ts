import { Upgrade } from './upgrade';

export class MineRate extends Upgrade {
        public baseRate: number;
        public maxRate: number;

        constructor(level: number, cost: number, baseRate: number, maxRate: number, time: number) {
            super(level, cost, time);
            this.baseRate = baseRate;
            this.maxRate = maxRate;
        }
    }
