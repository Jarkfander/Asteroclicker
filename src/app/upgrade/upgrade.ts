export class Upgrade {

        public lvl: number;
        public cost: number;
        public time: number;

        constructor(level: number, _cost: number, _time: number) {
            this.lvl = level;
            this.cost = _cost;
            this.time = _time;
        }

        public display() {
            let text = 'level : ' + this.lvl;
            text = 'cost ' +  this.cost;
            return text;
        }
    }
