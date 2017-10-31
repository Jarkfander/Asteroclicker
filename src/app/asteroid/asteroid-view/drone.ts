import * as PIXI from 'pixi.js';

export class Drone {
    drone: PIXI.Sprite;
    app: PIXI.Application;

    constructor(x: number , y: number, app: PIXI.Application) {
        this.app = app;
        this.drone = PIXI.Sprite.fromImage('assets/drone.png');
        this.drone.texture.baseTexture.mipmap = true;
        this.drone.anchor.set(0.5);
        this.drone.scale.set(x, y);

        this.drone.x = this.app.renderer.width / 2;
        this.drone.y = this.app.renderer.height / 2 - 200;
        this.app.stage.addChild(this.drone);

        this.onAssetsLoaded();
    }

    // Animation
    private onAssetsLoaded() {
        PIXI.loader.add('laser', './assets/laser_(n2).png').load((loader, resources) => {
            const laser = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(resources.laser.texture, 946, 964));
            laser.gotoAndPlay(0);
            laser.anchor.set(0.5, 0.04);
            laser.animationSpeed = 0.35;
            this.drone.addChild(laser);
        });

        function getFramesFromSpriteSheet(texture, frameWidth, frameHeight) {
            const frames = [];
            for (let j = 0; j < texture.height - frameHeight; j += frameHeight) {
                for (let i = 0; i < texture.width - frameWidth; i += frameWidth) {
                    frames.push(new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(i, j, frameWidth, frameHeight)));
                }
            }
            return frames;
        }
    }
}
