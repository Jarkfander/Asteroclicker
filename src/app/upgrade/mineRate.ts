import { Upgrade } from './upgrade';

export class MineRate extends Upgrade {
        public baseRate: number;
        public maxRate: number;

        constructor(level: number, _cost: number, _baseRate: number, _maxRate: number) {
            super(level, _cost);
            this.baseRate = _baseRate;
            this.maxRate = _maxRate;
        }
    }
