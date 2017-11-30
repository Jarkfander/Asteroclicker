import { Upgrade } from './upgrade';

export class Research extends Upgrade {

    public searchTime: number;

    constructor(level: number, cost: number, time: number, searchTime: number) {
        super(level, cost, time,'research','Research');
        this.cara["searchTime"]=searchTime; 
        this.searchTime=searchTime;
    }
}
