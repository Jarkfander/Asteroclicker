import { MineRate } from '../upgrade/mineRate';
import { Storage } from '../upgrade/storage';

export class User {

    public uid: string;
    public credit: number;
    public email: string;
    public mineRateLvl: number;
    public storageLvl: number;
    public currentMineRate: number;
    public numAsteroid: number;

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
