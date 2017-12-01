import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet } from '../../loadAnimation';

export class Drone {
    drone: PIXI.Sprite;
    app: PIXI.Application;
    public laser: PIXI.extras.AnimatedSprite;
    laserFirstState: boolean;
    isBeginClick: boolean;

    delta: number;
    deltaGo: number;
    public isMining: boolean;
    xBaseDrone: number;
    yBaseDrone: number;
    laserAnim: PIXI.extras.AnimatedSprite;

    laserAnim_actif1: PIXI.extras.AnimatedSprite;
    laserAnim_actif2: PIXI.extras.AnimatedSprite;
    laserAnim_actif3: PIXI.extras.AnimatedSprite;
    
    constructor(x: number , y: number, app: PIXI.Application) {
        this.app = app;
        this.isMining = true;
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

        this.deltaGo = 0;

        this.isBeginClick = true;
        this.drone.addChild(this.laserAnim);
        this.initLaser();

        // Listen for animate update
        this.app.ticker.add((delta) => {
            if (this.drone) {
                if (this.delta > 2 * Math.PI) {
                    this.delta = 0;
                }
                this.delta += (2 * Math.PI) / 1000;
                if (this.isMining) {
                    if (this.deltaGo < 8) {
                        this.deltaGo += 0.08;
                        this.drone.x = this.drone.x - this.deltaGo;
                        this.drone.y = this.drone.y - Math.sin(this.deltaGo);
                        this.laserAnim.visible = false;
                        this.laserAnim_actif1.visible = false;
                        this.laserAnim_actif2.visible = false;
                        this.laserAnim_actif3.visible = false;
                        this.drone.rotation = 0;
                        this.delta = 0;
                    }
                    this.delta = 0;
                } else {
                    if (this.deltaGo >= 0) {
                        this.deltaGo -= 0.08;
                        this.drone.x = this.drone.x + this.deltaGo;
                        this.drone.y = this.drone.y + Math.sin(this.deltaGo);
                        this.delta = 0;
                        this.laserAnim.visible = this.deltaGo <= 1 ? true : false;
                    } else  {
                        this.drone.x = this.xBaseDrone + Math.cos(this.delta) * 50;
                        this.drone.y = this.yBaseDrone + Math.sin(this.delta) * 50;
                        this.drone.rotation = Math.sin(this.delta) * 0.25;
                    }
                }
            }
        });
    }

    initLaser() {
        this.laserAnim_actif1 = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['laserMinage1'].texture,
         946, 946));
        this.laserAnim_actif1.gotoAndPlay(0);
        this.laserAnim_actif1.anchor.set(0.5, 0.04);
        this.laserAnim_actif1.animationSpeed = 0.30;
        this.laserAnim_actif1.position.set(3000, 3000);

        this.laserAnim_actif1.visible = true;
        this.laserAnim_actif1.loop = false;

        this.drone.addChild(this.laserAnim_actif1);

        this.laserAnim_actif2 = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['laserMinage2'].texture,
        946, 946));
        this.laserAnim_actif2.gotoAndPlay(0);
        this.laserAnim_actif2.anchor.set(0.5, 0.04);
        this.laserAnim_actif2.position.set(3000, 3000);
        this.laserAnim_actif2.animationSpeed = 0.35;
        this.laserAnim_actif2.visible = true;

        this.drone.addChild(this.laserAnim_actif2);

        this.laserAnim_actif3 = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['laserMinage3'].texture,
        946, 946));
        this.laserAnim_actif3.gotoAndPlay(0);
        this.laserAnim_actif3.anchor.set(0.5, 0.04);
        this.laserAnim_actif3.animationSpeed = 0.25;
        this.laserAnim_actif3.position.set(3000, 3000);
        this.laserAnim_actif3.visible = true;
        this.laserAnim_actif3.loop = false;

        this.drone.addChild(this.laserAnim_actif3);
    }

    activeLaser() {
        if (this.isBeginClick) {
            this.laserAnim_actif1.position.set(0, 0);
            this.laserAnim_actif2.position.set(0, 0);
            this.laserAnim_actif3.position.set(0, 0);
            this.laserAnim_actif2.visible = false;
            this.laserAnim_actif3.visible = false;
            this.laserAnim_actif1.visible = true;
            this.laserAnim_actif1.stop();
            this.laserAnim_actif1.gotoAndPlay(0);
            this.isBeginClick = false;
            this.laserAnim_actif1.onComplete = () => {
                this.laserAnim_actif1.visible = false;
                this.laserAnim_actif2.visible = true;
            };
        }
    }

    desactivLaser() {
        if (!this.isBeginClick) {
            this.laserAnim_actif2.visible = false;
            this.laserAnim_actif3.visible = true;
            this.laserAnim_actif3.stop();
            this.laserAnim_actif3.gotoAndPlay(0);
            this.isBeginClick = true;
            this.laserAnim_actif3.onComplete = () => {
                this.laserAnim_actif3.visible = false;
                this.laserAnim_actif3.stop();
                this.laserAnim.visible = true;
            };
        }
    }


}
