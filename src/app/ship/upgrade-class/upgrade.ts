import { SharedModule } from "../../shared/shared.module";

export class Upgrade {

    public lvl: number;
    public cost: number;
    public time: number;
    public name: string;
    public displayName: string;

    public cara;
    public costOre;
    constructor(level: number, _cost: number, _time: number, name: string, displayName: string) {
        this.displayName = displayName;
        this.name = name;
        this.lvl = level;
        this.cost = _cost;
        this.time = _time;
        this.cara = {};

        const tempName = this.valuesOreForUpgrade(this.name);
        this.costOre = [tempName[0], tempName[1]];
    }

    public valuesOreForUpgrade(nameUpgrade: string) {
        switch (nameUpgrade) {
            case 'engine':
                return ['gold', 'titanium'];
            case 'storage':
                return ['carbon', 'hyperium'];
            case 'research':
                return ['carbon', 'iron'];
            case 'mineRate':
                return ['iron', 'titanium'];
            default:
            return 0;
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
    engine
}
