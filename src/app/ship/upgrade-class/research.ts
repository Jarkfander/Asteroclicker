import { Upgrade } from './upgrade';

export class Research extends Upgrade {

    public searchTime: number;

    public maxDistance: number;
    public minDistance: number;

    constructor(level: number, cost: number, time: number, searchTime: number, _maxDistance: number, _minDistance: number) {
        super(level, cost, time, 'research', 'Research');
        this.cara['searchTime'] = searchTime;
        this.searchTime = searchTime;
        this.maxDistance = _maxDistance;
        this.minDistance = _minDistance;
    }
}
