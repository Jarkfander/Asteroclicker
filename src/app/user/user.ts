import { MineRate } from "../upgrade/mineRate";
import { Storage } from "../upgrade/storage";

export class User {

    public uid:string;
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

}
