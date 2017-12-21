import { Upgrade } from './upgrade';

export class Engine extends Upgrade {
    public speed: number;

    constructor(level: number, cost: number, time: number, _speed: number) {
        super(level, cost, time, 'engine', 'Engine power');
        this.cara['speed'] = _speed;
        this.speed = _speed;
    }
}
