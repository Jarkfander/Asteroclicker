import { Upgrade } from './upgrade';

export class QG extends Upgrade {

    numberOfCargo: number;
    lvlMax: number;

    constructor(level: number, cost: number, time: number, numberOfCargo: number) {
        super(level, cost, time, 'QG', 'QG');
        this.numberOfCargo = numberOfCargo;
        this.lvlMax = level * 10;
        this.cara['Level Max'] = this.lvlMax;
    }

}
