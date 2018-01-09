export class Frenzy {
    state: boolean;
    timer: number;
    nextCombos: {};
    public comboInd: number =0;

    public constructor(state: boolean,timer:number, nextCombos) {
        this.comboInd=0;
        this.state = state;
        this.nextCombos = nextCombos;
        this.timer=timer;
    }

    public updateTimer(timer: number){
        this.timer=timer;
    }
}