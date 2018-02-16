export enum STATE_PIECE {
    SPAWN,
    STAY,
    GO,
    GOAWAY
}

export class AsteroidPiece extends PIXI.Sprite {
    public sprite: PIXI.Sprite;
    public moveSpace: number;
    public isOver: boolean;
    public values: number;
    public type: string;

    public basePosX: number;
    public basePosY: number;

    public state: STATE_PIECE;

    constructor(_sprite: PIXI.Texture, _moveSpace: number, _x, _y, _values, _type) {
        super(_sprite);
        this.values = _values;
        this.type = _type;
        this.basePosX = _x;
        this.basePosY = _y;
        this.moveSpace = _moveSpace;
        this.isOver = false;
        this.state = STATE_PIECE.SPAWN;
    }
}
