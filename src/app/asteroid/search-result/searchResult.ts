import { Asteroid } from "../asteroid-view/asteroid";

export class SearchResult {
    public results: Asteroid[];
    public timer: number;
    public start: number;

    constructor(results: Asteroid[], timer: number, start: number) {
        this.start = start;
        this.results = results;
        this.timer = timer;
    }
}
