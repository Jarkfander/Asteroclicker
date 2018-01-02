export class OreInfo {

    public name: string;
    public maxValue: number;
    public meanValue: number;
    public minValue: number;
    public miningSpeed: number;
    public lvlOreUnlock: number;

    constructor(name: string, maxValue: number, meanValue: number, minValue: number, miningSpeed: number, lvlOreUnlock: number) {
        this.name = name;
        this.maxValue = maxValue;
        this.meanValue = meanValue;
        this.minValue = minValue;
        this.miningSpeed = miningSpeed;
        this.lvlOreUnlock = lvlOreUnlock;
    }
}
