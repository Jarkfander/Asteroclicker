import { MineRate } from "../upgrade/mineRate";
import { Storage } from "../upgrade/storage";

export class User {

    public carbon: number;
    public credit: number;
    public email: string;
    public mineRate: MineRate;
    public storage: Storage;
    constructor() {
        this.mineRate=new MineRate();
        this.storage=new Storage();
    }

}
