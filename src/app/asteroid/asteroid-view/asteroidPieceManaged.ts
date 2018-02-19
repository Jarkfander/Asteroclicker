import { AsteroidPiece, STATE_PIECE } from './asteroidPiece';
import { Vector2 } from '../../shared/utils';
import { Subject } from 'rxjs/Subject';


export interface IPieceAsteroid {
    namePieces: string;
    values: number;
}

/*
* Managed asteroid piece
*/
export class AsteroidPiecesManaged {
    app: PIXI.Application;

    textPiecePatron: PIXI.Text;
    textPieces: PIXI.Text;

    // Asteroid piece
    asteroidPieceParent: AsteroidPiece;
    tempTabDeletePiece: Array<number>;

    asteroidPiecesManagedsubject = new Subject<IPieceAsteroid>();

    constructor(app: PIXI.Application) {
        this.app = app;

        // init pieces of asteroid
        this.asteroidPieceParent = new AsteroidPiece(PIXI.Texture.fromImage('assets/AsteroidParticle/parentPiece.png'), 0.5, 0, 0, 0, 'carbon');
        this.app.stage.addChild(this.asteroidPieceParent);

        // init text pieces
        this.tempTabDeletePiece = new Array<number>();
        this.textPieces = new PIXI.Text(' ',
            {
                fontFamily: 'Montserrat-Black',
                fontSize: 20, fill: 0x000FF00,
                align: 'center'
            });

        this.textPieces.x = this.app.renderer.width / 3 - 200;
        this.textPieces.y = this.app.renderer.height;

        this.app.stage.addChild(this.textPieces);
    }


    // TickerApp Manged
    tickerAppPiece(delta: number, collectible: number) {
        this.textAlphaDecrease();
        let pieceAster: PIXI.DisplayObject;
        let pieceAsterCast: AsteroidPiece;
        for (let i = 0; i < this.asteroidPieceParent.children.length; i++) {
            if (!this.asteroidPieceParent.children[i]) {
                continue;
            }
            pieceAster = this.asteroidPieceParent.children[i];
            pieceAsterCast = (this.asteroidPieceParent.children[i] as AsteroidPiece);

            switch (pieceAsterCast.state) {
                case STATE_PIECE.GOAWAY:
                    if (pieceAster.alpha < 0.1) {
                        this.tempTabDeletePiece.push(i);
                    } else {
                        pieceAster.alpha -= 0.05;
                    }
                    break;


                case STATE_PIECE.GO:
                    if (collectible > 0) {
                        if (pieceAster.y >= this.app.renderer.height) {
                            this.detroyPiece(pieceAsterCast.values, pieceAsterCast.type, i);
                            this.asteroidPieceParent.children[i].destroy();
                            this.addTextToPiecetext('+' + pieceAsterCast.values, '0x00FF00');
                        } else {
                            const vectGO = this.lerpVector2(pieceAster.x, pieceAster.y, this.app.renderer.width / 4, this.app.renderer.height + 50, 0.08);
                            pieceAster.x = vectGO.x;
                            pieceAster.y = vectGO.y;
                        }
                    }
                    break;

                case STATE_PIECE.STAY:
                    pieceAster.x = pieceAsterCast.basePosX + Math.cos(delta) * -2.40 * (3 + pieceAsterCast.moveSpace);
                    pieceAster.y = pieceAsterCast.basePosY + Math.sin(delta) * -2.05 * (3 + pieceAsterCast.moveSpace);
                    break;

                case STATE_PIECE.SPAWN:
                    const vectSPAWN = this.lerpVector2(pieceAster.x, pieceAster.y, pieceAsterCast.basePosX, pieceAsterCast.basePosY, 0.1);
                    pieceAster.x = vectSPAWN.x;
                    pieceAster.y = vectSPAWN.y;
                    /*
                    if (Math.abs(pieceAster.x - pieceAsterCast.basePosX) < 0.001 && Math.abs(pieceAster.y - pieceAsterCast.basePosY) < 0.001) {
                      pieceAsterCast.state = STATE_PIECE.STAY;
                    }*/
                    break;

            }

        }
    }

    // Piece of aste
    generatePiece(oreName: string, values, _x: number, _y: number) {
        // Voir pour reaffecter la valeur du tableau et pas la reset parce que le tableau se reduit tout seul
        const randomX = Math.random() * (this.app.renderer.width - 150) + 80;
        const randomY = Math.random() * (this.app.renderer.height - 150) + 80;

        const sprite = new AsteroidPiece(PIXI.Texture.fromImage('assets/AsteroidParticle/' + oreName + 'Particle.png'), Math.random() * 2, randomX, randomY, values, oreName);
        sprite.texture.baseTexture.mipmap = true;
        sprite.anchor.set(0.5);

        sprite.x = _x;
        sprite.y = _y;

        const randomScale = Math.random() + 0.5;
        sprite.scale.set(0.25 * randomScale, 0.25 * randomScale);
        sprite.rotation = Math.random() * 180;
        const circle = new PIXI.Graphics();
        circle.beginFill(0x0000FF, 0);
        circle.drawCircle(150, 150, 200 * (1 - sprite.scale.x));
        circle.endFill();
        circle.alpha = 0.5;
        circle.x -= (sprite.width) + 150;
        circle.y -= (sprite.height) + 150;
        sprite.addChild(circle);

        circle.interactive = true;

        this.asteroidPieceParent.addChild(sprite);

        circle.on('mouseover', (event) => {
            sprite.state = STATE_PIECE.GO;
        });
    }
    // detroy
    detroyPiece(values, orename, i) {
        const temp = {values: values, namePieces: orename};
        this.asteroidPiecesManagedsubject.next(temp);
    }

    // State PIECE GO AWAY
    pieceGoAway() {
        for (let i = 0; i < this.asteroidPieceParent.children.length; i++) {
            if (this.asteroidPieceParent.children[i]) {
                (this.asteroidPieceParent.children[i] as AsteroidPiece).state = STATE_PIECE.GOAWAY;
            }
        }
    }

    lerpVector2(sourceX, sourceY, destX, destY, delta, isRotate = false) {
        const vect = new Vector2(); const vectorTemp = new Vector2();
        vectorTemp.initXY(sourceX, sourceY);
        vect.initXYVector(vectorTemp.lerp(destX, destY, delta));
        return vect;
    }

    /*
    * MANAGED Text
    */
    textAlphaDecrease() {
        const tempErase = new Array<number>();
        for (let i = 0; i < this.textPieces.children.length; i++) {
            if (this.textPieces.children[i].alpha < 0) {
                tempErase.push(i);
                continue;
            }
            this.textPieces.children[i].y -= 1.8;
            this.textPieces.children[i].alpha -= 0.01;
        }
        for (let i = 0; i < tempErase.length; i++) {
            this.textPieces.children.splice(tempErase[i], 1);
        }
    }

    textAlphaToOne(i: number) {
        for (let d = 0; d < this.textPieces.children.length; d++) {
            this.textPieces.children[d].alpha = 1;
        }
    }

    addTextToPiecetext(values, color) {
        const textTemp = new PIXI.Text(values,
            {
                fontFamily: 'Montserrat-Black',
                fontSize: 20, fill: color,
                align: 'center'
            });
        textTemp.alpha = 1;
        textTemp.x += Math.random() * 250;
        this.textPieces.addChild(textTemp);
    }
}
