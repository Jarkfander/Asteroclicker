export class Asteroid {

    public capacity: number;
    public purity: number;
    public ore: string;
    public timeToGo: number;
    public seed: string;

    constructor(capacity: number, purity: number, ore: string, seed: string, timeToGo: number) {
        this.capacity = capacity;
        this.purity = purity;
        this.ore = ore;
        this.seed= seed;
        this.timeToGo = timeToGo;
    }
}
