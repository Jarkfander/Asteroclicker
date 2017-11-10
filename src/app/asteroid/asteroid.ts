export class Asteroid {
    public maxstock : number;
    public mineRate : number;
    public ore: string;

    constructor(maxstock : number,mineRate : number,ore: string) {
        this.maxstock=maxstock;
        this.mineRate=mineRate;
        this.ore=ore;
    }
}
