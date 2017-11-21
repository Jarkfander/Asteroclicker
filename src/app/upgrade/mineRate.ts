import { Upgrade } from './upgrade';

export class MineRate extends Upgrade {
        public baseRate: number;
        public maxRate: number;

        constructor(level: number, cost: number, baseRate: number, maxRate: number) {
            super(level, cost);
            this.baseRate = baseRate;
            this.maxRate = maxRate;
        }
    }
