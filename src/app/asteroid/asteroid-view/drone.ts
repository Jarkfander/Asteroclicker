import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet } from '../../loadAnimation';

export class Drone {
    drone: PIXI.Sprite;
    app: PIXI.Application;
    public laser: PIXI.extras.AnimatedSprite;
    laserFirstState:boolean;

    delta: number;
    asteroidDone: boolean;
    xBaseDrone: number;
    yBaseDrone: number;
    laserAnim: PIXI.extras.AnimatedSprite;

    constructor(x: number , y: number, app: PIXI.Application) {
        this.app = app;
        this.asteroidDone = true;
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


        this.laserAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['laser'].texture, 946, 964));
        this.laserAnim.gotoAndPlay(0);
        this.laserAnim.anchor.set(0.5, 0.04);
        this.laserAnim.animationSpeed = 0.35;
        this.laserAnim.visible = true;

        this.drone.addChild(this.laserAnim);

        // Listen for animate update
        this.app.ticker.add((delta) => {
            if (this.drone) {
                if (this.delta > 2 * Math.PI) {
                    this.delta = 0;
                }
                this.delta += (2 * Math.PI) / 1000;
                if (this.asteroidDone) {
                    this.drone.x = this.xBaseDrone;
                    this.drone.y = this.yBaseDrone;
                    this.drone.rotation = 0;
                    this.laserAnim.visible = false;
                } else {
                    this.laserAnim.visible = true;
                    this.drone.x = this.xBaseDrone + Math.cos(this.delta) * 50;
                    this.drone.y = this.yBaseDrone + Math.sin(this.delta) * 50;
                    this.drone.rotation = Math.sin(this.delta) * 0.25;
                }
            }
        });
    }
}
