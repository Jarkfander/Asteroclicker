import { Quest } from '../../quest/quest';
import { Frenzy } from './frenzy';
import { IAsteroid } from '../../asteroid/asteroid.service';
import { SearchResult } from '../../ore/search-result/searchResult';

export class UserUpgrade {
    public lvl: number;
    public timer: number;
    public start: number;

    constructor(lvl: number, timer: number, start: number) {
        this.lvl = lvl;
        this.timer = timer;
        this.start = start;
    }
}

export class User {

    public uid: string;
    public credit: number;

    public email: string;
    public name: string;

    public currentMineRate: number;

    public score: number;

    public asteroidSearch: SearchResult;

    public quest: Quest;
    public chest: Array<Chest>;
    public numberOfChest: number;

    public upgrades: UserUpgrade[];

    public event: number;

    public frenzy: Frenzy;

    public boolBadConfig: boolean;

    public cargo: any;

    constructor() {
        this.upgrades = Array();
        this.chest = new Array<Chest>();
        this.boolBadConfig = true;
    }

    public destroyChest() {
        for (let i = 0; i < this.chest.length; i++) {
            this.chest.pop();
        }
    }

}

export class Chest {
    chest1: any;
    chest2: any;
    chest3: any;

    constructor(_chest1, _chest2, _chest3) {
        this.chest1 = _chest1;
        this.chest2 = _chest2;
        this.chest3 = _chest3;
    }
}



