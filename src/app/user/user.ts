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
    }

}
