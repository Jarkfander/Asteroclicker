export class Utils {
    static secondsToHHMMSS(time: number) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - (hours * 3600)) / 60);
        const seconds = Math.floor(time - (hours * 3600) - (minutes * 60));

        let out = hours < 10 ? '0' + hours : '' + hours;
        out += minutes < 10 ? ':0' + minutes : ':' + minutes;
        out += seconds < 10 ? ':0' + seconds : ':' + seconds;

        return out;
    }
}

export class Vector2 {
    x: number;
    y: number;
    rotate: number;
    constructor() { }

    initXY(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }

    initXYVector(vect: Vector2) {
        this.x = vect.x;
        this.y = vect.y;
    }
    // LERP - - - - - - -
    lerp(_x: number, _y: number, delta: number) {
        this.x += (_x - this.x) * delta;
        this.y += (_y - this.y) * delta;
        return this;
    }

    // LERP Rotation - - - - - - -
    lerpRotate(_rotate: number, delta: number) {
        this.rotate += (_rotate - this.rotate) * delta;
        return this.rotate;
    }
}
