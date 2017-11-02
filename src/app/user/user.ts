import { MineRate } from "../upgrade/mineRate";
import { Storage } from "../upgrade/storage";

export class User {

    public uid:string;
    public carbon: number;
    public credit: number;
    public email: string;
    public mineRateLvl: number;
    public storageLvl: number;
    
    constructor() {
<<<<<<< HEAD
=======
        this.mineRate = new MineRate(0, 0, 0, 0);
        this.storage = new Storage(0, 0, 0);
>>>>>>> 34387eedf9f5dfee63842d47f08488f8e8721314
    }

}
