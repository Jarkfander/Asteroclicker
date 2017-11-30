export class Ranking {

    public score: string;
    public name: string;
    public id: number;

    constructor(_name: string, _score: string, _id: number) {
        this.name = _name;
        this.score = _score;
        this.id = _id + 1;
    }
}
