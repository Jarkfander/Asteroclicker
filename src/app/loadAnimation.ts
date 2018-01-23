import * as PIXI from 'pixi.js';
import { app } from 'firebase/app';


export class LoadAnimation {
    public boolFinishLoad = false;
    tabKeyName: String[];
    tabSpriteName: String[];

    constructor() {
        this.tabKeyName = new Array<String>();
        this.tabSpriteName = new Array<String>();

        // ciel animation
        for (let i = 1; i < 3; i++) {
            this.addKeySpriteName('ciel1_' + i, './assets/sky/ciel1_' + i + '.png');
        }

        // ciel animation V1
        for (let i = 1; i < 3; i++) {
            this.addKeySpriteName('ciel2_' + i, './assets/sky/ciel2_' + i + '.png');
        }

        // ciel animation V2
        for (let i = 1; i < 3; i++) {
            this.addKeySpriteName('ciel3_' + i, './assets/sky/ciel3_' + i + '.png');
        }

        // etoile filante
        this.addKeySpriteName('etoile_filante', './assets/sky/etoile_filante.png');

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

        for (let i = 1; i < 4; i++) {
            this.addKeySpriteName('drone' + i, './assets/drone' + i + '.png');
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


// Animated Sprite
export function getFramesFromSpriteSheet(texture: PIXI.Texture, frameWidth: number, frameHeight: number) {
    const frames = [];
    for (let j = 0; j < texture.height - frameHeight + 1; j += frameHeight) {
        for (let i = 0; i < texture.width - frameWidth + 1; i += frameWidth) {
            frames.push(new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(i, j, frameWidth, frameHeight)));
        }
    }
    return frames;
}

export function initSprite(spriteName: string, width: number, height: number,
    visible = true, play = true, animationSpeed: number = 0.35,
    anchorSet: number = 0.5) {
    const animatedSprite = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
        PIXI.loader.resources[spriteName].texture, width, height));
    animatedSprite.animationSpeed = animationSpeed;
    animatedSprite.visible = visible;
    animatedSprite.anchor.set(anchorSet);
    animatedSprite.loop = true;
    play ? animatedSprite.play() : animatedSprite.stop();

    return animatedSprite;
}

export function changeSpriteInAnime(animatedSprite, name: string, iTemp: number, numberOfSpriteMax: number) {
    iTemp = ((iTemp + 1) % numberOfSpriteMax) === 0 ? 1 : ((iTemp + 1) % numberOfSpriteMax);
    const stringTemp: string = name + iTemp;

    const tempSprite = getFramesFromSpriteSheet(PIXI.loader.resources[stringTemp].texture, 500, 500);

    for (let i = 0; i < animatedSprite.textures.length; i++) {
        animatedSprite.textures[i] = tempSprite[i];
    }
    return iTemp;
}
