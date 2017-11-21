import { Asteroid } from "./asteroid";

export class AsteroidSearch {
    public results : Asteroid[];
    public timer : number;

    constructor(results : Asteroid[], timer : number) {
        this.results=results;
        this.timer=timer;
    }
}
