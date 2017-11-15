import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet } from '../../loadAnimation';

export class Drone {
    drone: PIXI.Sprite;
    app: PIXI.Application;
    public laser: PIXI.extras.AnimatedSprite;
    laserFirstState:boolean;

    delta: number;

    xBaseDrone: number;
    yBaseDrone: number;

    constructor(x: number , y: number, app: PIXI.Application) {
        this.app = app;
        this.delta = 0;
        this.drone = PIXI.Sprite.fromImage('assets/drone.png');
        this.drone.texture.baseTexture.mipmap = true;
        this.drone.anchor.set(0.5);
        this.drone.scale.set(x, y);

        this.drone.x = this.app.renderer.width / 2;
        this.drone.y = this.app.renderer.height / 2 - 150;
        this.app.stage.addChild(this.drone);

        this.xBaseDrone = this.drone.x;
        this.yBaseDrone = this.drone.y;


        const laserAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['laser'].texture, 946, 964));
        laserAnim.gotoAndPlay(0);
        laserAnim.anchor.set(0.5, 0.04);
        laserAnim.animationSpeed = 0.35;
        laserAnim.visible = true;

        this.drone.addChild(laserAnim);

        // Listen for animate update
        this.app.ticker.add((delta) => {
            if (this.drone) {
                if (this.delta > 2 * Math.PI) {
                    this.delta = 0;
                }
                this.delta += (2 * Math.PI) / 1000;

                this.drone.x = this.xBaseDrone + Math.cos(this.delta) * 50;
                this.drone.y = this.yBaseDrone + Math.sin(this.delta) * 50;
                this.drone.rotation = Math.sin(this.delta) * 0.25;
            }
        });
    }
}
