import { MineRate } from '../upgrade/mineRate';
import { Storage } from '../upgrade/storage';
import { Quest } from '../topbar/quest';
import { AsteroidSearch } from '../asteroid/asteroidSearch';
import { Asteroid } from '../asteroid/asteroid';

export class User {

    public uid: string;
    public credit: number;
    public email: string;
    public mineRateLvl: number;
    public storageLvl: number;
    public researchLvl: number;
    public currentMineRate: number;

    public asteroid: Asteroid;

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

}
