import * as PIXI from 'pixi.js';
import { app } from 'firebase/app';
export function getFramesFromSpriteSheet(texture: PIXI.Texture, frameWidth: number, frameHeight: number) {
    const frames = [];
    for (let j = 0; j < texture.height - frameHeight + 1; j += frameHeight) {
        for (let i = 0; i < texture.width - frameWidth + 1; i += frameWidth) {
            frames.push(new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(i, j, frameWidth, frameHeight)));
        }
    }
    return frames;
}


export class LoadAnimation {
    public boolFinishLoad = false;
    tabKeyName: String[];
    tabSpriteName: String[];

    constructor() {
        this.tabKeyName = new Array<String>();
        this.tabSpriteName = new Array<String>();

        // ciel animation
        for (let i = 1; i < 7; i++) {
            this.addKeySpriteName('skyV0_' + i, './assets/sky/ciel_niv0_p' + i + '.png');
        }

        // ciel animation V1
        for (let i = 1; i < 7; i++) {
            this.addKeySpriteName('skyV1_' + i, './assets/sky/Cielv1_p' + i + '.png');
        }

        // Laser
        this.addKeySpriteName('laser', './assets/laser_(n2).png');
        this.addKeySpriteName('ship', './assets/upgrade/ship.png');
        // tourelle animation
        for (let i = 1; i < 4; i++) {
            this.addKeySpriteName('tourelle_' + i, './assets/upgrade/tourelle' + i + '.png');
        }

        // Stock animation
        for (let i = 1; i < 8; i++) {
            this.addKeySpriteName('shipEngine_' + i, './assets/upgrade/engine/engine_' + i + '.png');
        }

        // Radar animation
        for (let i = 1; i < 6; i++) {
            this.addKeySpriteName('shipRadar_' + i, './assets/upgrade/shipRadar_' + i + '.png');
        }

        // smoke animation
        for (let i = 1; i < 8; i++) {
            this.addKeySpriteName('smoke_' + i, './assets/upgrade/smoke' + i + '.png');
        }

        // laser animation
        for (let i = 1; i < 4; i++) {
            this.addKeySpriteName('laserMinage' + i, './assets/laser_minage' + i + '.png');
        }

        // laser animation
        for (let i = 1; i < 6; i++) {
            this.addKeySpriteName('droneUpdate_' + i, './assets/upgrade/drone_' + i + '.png');
        }

        // newTourelle animation
        for (let i = 1; i < 7; i++) {
            this.addKeySpriteName('newTourelle_' + i, './assets/upgrade/storage/newTourelle_' + i + '.png');
        }

        // stock animation
        for (let i = 1; i < 6; i++) {
            this.addKeySpriteName('stockage_' + i, './assets/upgrade/storage/stockage_' + i + '.png');
        }

        // chest animation
        for (let i = 1; i < 4; i++) {
            this.addKeySpriteName('coffre_anim' + i, './assets/capsule/coffre_anim' + i + '.png');
        }

        for (let i = 1; i < 3; i++) {
            this.addKeySpriteName('bulle' + i, './assets/capsule/bulle_anim' + i + '.png');
        }

        this.addKeySpriteName('explosionBulle', './assets/capsule/explosion_spritesheet.png');

        this.addKeySpriteName('Boum', './assets/Boum.png');
        this.addKeySpriteName('krash', './assets/krash.png');
        this.addKeySpriteName('kaboom', './assets/kaboom.png');
        this.addKeySpriteName('woom', './assets/woom.png');

        this.onAssetsLoaded();
    }

    // Add keyname and Sprite name to the loader
    private addKeySpriteName(keyname: string, spritename: string) {
        this.tabKeyName.push(keyname);
        this.tabSpriteName.push(spritename);
    }

    // Load the loader for animation
    private onAssetsLoaded() {
        for (let i = 0; i < this.tabKeyName.length; i++) {
            PIXI.loader.add(this.tabKeyName[i], this.tabSpriteName[i]);
        }
        PIXI.loader.load((loader, resources) => {
            this.boolFinishLoad = true;
        });
    }
}
