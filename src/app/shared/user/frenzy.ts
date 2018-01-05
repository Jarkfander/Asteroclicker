export class Frenzy {
    state: boolean;
    timer: number;
    start: number;
    nextCombo: number;

    public constructor(state: boolean, timer: number, start: number, nextcombo: number) {
        this.state = state;
        this.timer = timer;
        this.start = start;
        this.nextCombo = nextcombo;
    }
}