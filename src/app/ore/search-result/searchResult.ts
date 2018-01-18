import { IAsteroid } from "../../asteroid/asteroid.service";




export class SearchResult {
    public results: IAsteroid[];
    public timer: number;
    public start: number;

    constructor(results: IAsteroid[], timer: number, start: number) {
        this.start = start;
        this.results = results;
        this.timer = timer;
    }
}
