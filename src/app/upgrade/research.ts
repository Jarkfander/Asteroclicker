import { Upgrade } from './upgrade';

export class Research extends Upgrade {
        public time: number;

        constructor(level: number, cost: number, time: number) {
            super(level, cost);
            this.time = time;
        }
    }
