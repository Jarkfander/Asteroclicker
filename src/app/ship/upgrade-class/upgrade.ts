export class Upgrade {

    public lvl: number;
    public cost: number;
    public time: number;
    public name: string;
    public displayName: string;

    public cara;
    constructor(level: number, _cost: number, _time: number, name: string, displayName: string) {
        this.displayName = displayName;
        this.name = name;
        this.lvl = level;
        this.cost = _cost;
        this.time = _time;
        this.cara = {};
    }

}

export enum UpgradeType {
    mineRate,
    research,
    storage,
    engine
}
