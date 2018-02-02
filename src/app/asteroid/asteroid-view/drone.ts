import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet, initSprite } from '../../loadAnimation';

export enum STATS_DRONE {
    MINING = 0,
    GO_OUT = 1,
    GO_IN = 2,
    NO_MINING = 3,
    MOD_FRENZY = 4
}


export class Vector2 {
    x: number;
    y: number;
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
}


export class Drone {
    isFirstTimeBack: boolean;
    private isUserHaveMaxCapacityStorage: boolean;
    private isAsteLifeSupZero: boolean;
    app: PIXI.Application;
    public drone: PIXI.extras.AnimatedSprite;


    public laser: PIXI.extras.AnimatedSprite;
    isBeginClick: boolean;

    delta: number;
    deltaGo: number;
    public isMining: boolean;
    statsActu: STATS_DRONE;


    xBaseDrone: number;
    yBaseDrone: number;
    laserAnim: PIXI.extras.AnimatedSprite;

    laserAnim_actif1: PIXI.extras.AnimatedSprite;
    laserAnim_actif2: PIXI.extras.AnimatedSprite;
    laserAnim_actif3: PIXI.extras.AnimatedSprite;

    constructor(x: number, y: number, xpos: number, ypos: number, isMining: boolean, app: PIXI.Application) {
        this.app = app;
        this.isMining = isMining;
        this.statsActu = STATS_DRONE.MINING;
        this.delta = 0;

        // Drone
        this.drone = initSprite('drone1', 266, 308, true, true);
        this.drone.scale.set(x + 0.15, y + 0.15);
        this.drone.loop = true;

        this.drone.x = this.app.renderer.width / 2 + xpos;
        this.drone.y = this.app.renderer.height / 2 - 150 + ypos;

        this.xBaseDrone = this.drone.x;
        this.yBaseDrone = this.drone.y;

        this.app.stage.addChild(this.drone);

        /*
        PIXI.loader.load(function(loader, resources) {
            resources.laserSound.data.play();
        });
        */


        // LaserAnim
        this.laserAnim = initSprite('laser', 946, 964, true, true);
        this.laserAnim.scale.set(0.60, 0.60);
        this.laserAnim.anchor.set(0.54, -0.08);

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

                this.moveDroneAffectStats();
                this.moveDroneInTermsOfStats();
            }
        });
    }

    /*
    *   MANAGE DRONE MOVEMENT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    */
    // affect the stats of drone
    moveDroneAffectStats() {
        if (!this.isMining) {
            if (this.deltaGo < 8) {
                this.statsActu = STATS_DRONE.GO_OUT;
            } else {
                this.statsActu = STATS_DRONE.NO_MINING;
            }
        } else {
            if (this.statsActu !== STATS_DRONE.MOD_FRENZY) {
                if (this.deltaGo >= 0) {
                    this.statsActu = STATS_DRONE.GO_IN;
                } else {
                    this.statsActu = STATS_DRONE.MINING;
                }
            }
        }
    }
    // stats Drone apply move
    moveDroneInTermsOfStats() {
        this.drone.visible = true;
        switch (this.statsActu) {
            case STATS_DRONE.MINING:
            if ( Math.abs(this.drone.x - this.xBaseDrone) > 0.1 && Math.abs(this.drone.y - this.yBaseDrone) > 0.1) {
                    const vect = new Vector2();
                    const vectorTemp = new Vector2();
                    vectorTemp.initXY(this.drone.x, this.drone.y);
                    vect.initXYVector(vectorTemp.lerp(this.xBaseDrone, this.yBaseDrone, 0.025));
                    this.drone.x = vect.x;
                    this.drone.y = vect.y;
                } else {
                    this.drone.x = this.xBaseDrone;
                    this.drone.y = this.yBaseDrone;
                    this.drone.rotation = Math.sin(this.delta) * 0.45;
                }
                break;

            case STATS_DRONE.GO_OUT:
                this.deltaGo += 0.08;
                this.drone.rotation = 0;
                this.drone.x = this.drone.x - this.deltaGo;
                this.drone.y = this.drone.y - Math.sin(this.deltaGo);
                this.LaserAnimVisible(false, false, false, false);
                break;

            case STATS_DRONE.NO_MINING:
                this.drone.visible = false;
                break;

            case STATS_DRONE.GO_IN:
                this.deltaGo -= 0.08;
                this.drone.x += this.deltaGo;
                this.drone.y += Math.sin(this.deltaGo);
                this.laserAnim.visible = this.deltaGo <= 1 ? true : false;
                this.delta = 0;
                break;

            case STATS_DRONE.MOD_FRENZY:
                if (this.laserAnim.visible) {
                    this.laserAnim.visible = false;
                    this.activeLaser();
                }
                this.drone.x = this.xBaseDrone + Math.cos(this.delta * 5) * 25 - 25;
                this.drone.y = this.yBaseDrone + Math.sin(this.delta * 5) * 50;
                this.drone.rotation = Math.sin(this.delta * 5) * 0.50;
                break;

            default: return;
        }
    }

    // DIsplay the stats
    displayStats() {
        switch (this.statsActu) {
            case STATS_DRONE.MINING:
                console.log('MINING');
                break;

            case STATS_DRONE.GO_OUT:
                console.log('GO_OUT');
                break;

            case STATS_DRONE.NO_MINING:
                console.log('NO_MINING');
                break;

            case STATS_DRONE.GO_IN:
                console.log('GO_IN');
                break;

            case STATS_DRONE.MOD_FRENZY:
                console.log('MOD_FRENZY');
                break;

            default: return;
        }
    }

    /*
    *   MANAGE LASER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    */
    LaserAnimVisible(laserAnimBool, laserAnim1Bool, laserAnim2Bool, laserAnim3Bool) {
        this.laserAnim.visible = laserAnimBool;
        this.laserAnim_actif1.visible = laserAnim1Bool;
        this.laserAnim_actif2.visible = laserAnim2Bool;
        this.laserAnim_actif3.visible = laserAnim3Bool;
    }
    // init the position and the scale of the laser
    initLaserPositionScale(laser: PIXI.extras.AnimatedSprite) {
        laser.anchor.set(0.53, -0.09);
        laser.position.set(3000, 3000);
        laser.scale.set(0.60, 0.60);
        laser.loop = false;
        this.drone.addChild(laser);
    }
    // init the sprite sheet of the laser
    initLaser() {
        this.laserAnim_actif1 = initSprite('laserMinage1', 946, 946, true, true, 0.30);
        this.initLaserPositionScale(this.laserAnim_actif1);

        this.laserAnim_actif2 = initSprite('laserMinage2', 946, 946, true, true, 0.35);
        this.initLaserPositionScale(this.laserAnim_actif2);
        this.laserAnim_actif2.loop = true;

        this.laserAnim_actif3 = initSprite('laserMinage3', 946, 946, true, true, 0.25);
        this.initLaserPositionScale(this.laserAnim_actif3);
    }

    activeLaser() {
        if (this.isBeginClick) {
            this.laserAnim_actif1.position.set(0, 0);
            this.laserAnim_actif2.position.set(0, 0);
            this.laserAnim_actif3.position.set(0, 0);
            this.LaserAnimVisible(this.laserAnim.visible, false, false, true);
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


    changeSpriteDrone(lvl: number) {
        const num = lvl <= 10 ? 1 :
            lvl <= 25 ? 2 : 3;
        const temp = getFramesFromSpriteSheet(PIXI.loader.resources['drone' + num].texture, 266, 308);
        for (let i = 0; i < this.drone.textures.length; i++) {
            this.drone.textures[i] = temp[i];
        }
    }


    /*
    *   MANAGED IF THE DRONE MINE OF NOT
    */
    setIsAsteLifeSupZero(bool: boolean) {
        this.isAsteLifeSupZero = bool;
        this.droneMiningVerif();
    }

    setIsUserHaveMaxCapacityStorage(bool: boolean) {
        this.isUserHaveMaxCapacityStorage = bool;
        this.droneMiningVerif();
    }

    droneMiningVerif() {
        if (this.isAsteLifeSupZero === undefined || this.isUserHaveMaxCapacityStorage === undefined) {
            this.isMining = false;
        } else {
            this.isMining = this.isAsteLifeSupZero && !this.isUserHaveMaxCapacityStorage;
        }
    }



}
