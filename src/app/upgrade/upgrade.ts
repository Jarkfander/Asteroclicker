export class Upgrade {

        public lvl: number;
        public cost: number;

        constructor(level: number, _cost: number) {
            this.lvl = level;
            this.cost = _cost;
        }

        public display() {
            let text = 'level : ' + this.lvl;
            text = 'cost ' +  this.cost;
        }
    }
