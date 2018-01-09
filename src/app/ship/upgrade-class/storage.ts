import { Upgrade } from './upgrade';
import { SharedModule } from '../../shared/shared.module';

export class Storage extends Upgrade {

    public capacity: number;

    constructor(level: number, cost: number, capacity: number, time: number) {
        super(level, cost, time, 'storage', 'Storage');
        this.capacity = capacity;
        this.cara['capacity'] = this.capacityValue();
    }

    public capacityValue() {
        return SharedModule.calculeMoneyWithSpace(this.capacity);
    }
}
