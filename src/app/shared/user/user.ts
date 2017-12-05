import { Asteroid } from "../../asteroid/asteroid-view/asteroid";
import { SearchResult } from "../../asteroid/search-result/searchResult";
import { Quest } from "../../market/topbar/quest";


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

    public timerRate: number;
    public timerStock: number;
    public currentMineRate: number;

    public asteroid: Asteroid;
    public score: number;

    public asteroidSearch: SearchResult;

    public quest: Quest;

    public oreAmounts: JSON;

    public upgrades: UserUpgrade[];

    constructor() {
        this.upgrades = Array();
    }

    // 1000000 => 1 000 000
    public calculeMoneyWithSpace() {
        const temp = ((Math.round(this.credit * 100) / 100).toFixed(2)).toString();
        let newCredit = '';
        let boolVirgule = true;
        let tempi = 0;
        for (let j = 0; j < (temp.length - 3) % 3; j++) {
            newCredit = newCredit + temp[j];
            tempi = j + 1;
        }
        if (tempi > 0 && this.credit > 100) {
            newCredit = newCredit + ' ';
        }

        for (let i = tempi; i < temp.length; i++) {
            if (temp[i + 1] === '.') {
                boolVirgule = false;
            }
            newCredit = newCredit + temp[i];
            if (((i + 1) - tempi) % 3 === 0 && i !== temp.length - 1 && boolVirgule) {
                newCredit = newCredit + ' ';
            }
        }
        return newCredit;
    }

}
