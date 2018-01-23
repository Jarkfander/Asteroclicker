import { SharedModule } from "../../shared/shared.module";

export class Upgrade {

    public lvl: number;
    public cost: number;
    public time: number;
    public name: string;
    public displayName: string;

    public cara;
    public costOre: any;
    public costOreString: any;

    constructor(level: number, _cost, _time: number, name: string, displayName: string) {
        this.displayName = displayName;
        this.name = name;
        this.lvl = level;
        this.time = _time;
        this.cara = {};

        const keysCost = Object.keys(_cost);
        this.costOreString = {};
        for (let i = 0; i < keysCost.length; i++) {
            this.costOreString[keysCost[i]] = _cost[keysCost[i]];
        }
    }

    public costValue() {
        return SharedModule.calculeMoneyWithSpace(this.cost);
    }
}


export enum UpgradeType {
    mineRate,
    research,
    storage,
    engine,
    QG
}
