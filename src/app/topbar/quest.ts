export class Quest {

    public name: string;
    public type: string;
    public values: number;
    public num: number;
    public gain: number;
    public valuesFinal: number;
    public text: number;

    constructor(_name: string, _type: string, _values: number, _num: number, _gain: number) {
        this.name = _name;
        this.type = _type;
        this.values = _values;
        this.num = _num;
        this.gain = _gain;
    }
}
