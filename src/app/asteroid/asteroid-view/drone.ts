import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet } from '../../loadAnimation';

export class Drone {
    drone: PIXI.Sprite;
    app: PIXI.Application;
    public laser: PIXI.extras.AnimatedSprite;
    laserFirstState:boolean;

    constructor(x: number , y: number, app: PIXI.Application) {
        this.app = app;
        this.drone = PIXI.Sprite.fromImage('assets/drone.png');
        this.drone.texture.baseTexture.mipmap = true;
        this.drone.anchor.set(0.5);
        this.drone.scale.set(x, y);

        this.drone.x = this.app.renderer.width / 2;
        this.drone.y = this.app.renderer.height / 2 - 150;
        this.app.stage.addChild(this.drone);

        const laserAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['laser'].texture, 946, 964));
        laserAnim.gotoAndPlay(0);
        laserAnim.anchor.set(0.5, 0.04);
        laserAnim.animationSpeed = 0.35;
        laserAnim.visible = true;

        this.drone.addChild(laserAnim);
    }
}
