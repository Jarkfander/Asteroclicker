import { MineRate } from '../upgrade/mineRate';
import { Storage } from '../upgrade/storage';
import { Quest } from '../topbar/quest';
import { AsteroidSearch } from '../asteroid/asteroidSearch';
import { Asteroid } from '../asteroid/asteroid';

export class User {

    public uid: string;
    public credit: number;

    public email: string;
    public name: string;
    public mineRateLvl: number;
    public timerRate: number;

    public storageLvl: number;
    public timerStock: number;

    public researchLvl: number;
    public currentMineRate: number;

    public asteroid: Asteroid;
    public score: number;

    public asteroidSearch: AsteroidSearch;

    public quest: Quest;

    public carbon: number;
    public titanium: number;

    constructor() {
    }

    public getOreAmountFromString(oreName: string) {
        switch (oreName) {
            case 'carbon':
                return this.carbon;
            case 'titanium':
                 return this.titanium;
            default:
                console.log('unknown material (user)' + oreName);
                break;
        }
    }

    // 1000000 => 1 000 000
    public calculeMoneyWithSpace() {
        const temp = ((Math.round(this.credit * 100) / 100).toFixed(2)).toString();
        let newCredit = '';
        let boolVirgule = true;
        let tempi = 0;
        for (let j = 0 ; j < (temp.length - 3) % 3  ; j++) {
            newCredit = newCredit + temp[j];
            tempi = j + 1;
        }
        if (tempi > 0 && this.credit > 100) {
            newCredit = newCredit + ' ';
        }

        for (let i = tempi ; i < temp.length ; i++) {
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
