import * as PIXI from 'pixi.js';
export function getFramesFromSpriteSheet(texture: PIXI.Texture, frameWidth: number, frameHeight: number) {
    const frames = [];
    for (let j = 0; j < texture.height - frameHeight; j += frameHeight) {
        for (let i = 0; i < texture.width - frameWidth; i += frameWidth) {
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

        // Laser
        this.addKeySpriteName('laser', './assets/laser_(n2).png');
        this.addKeySpriteName('ship', './assets/upgrade/ship.png');
         // tourelle animation
         for (let i = 1 ; i < 4 ; i++) {
            this.addKeySpriteName('tourelle_' + i, './assets/upgrade/tourelle' + i + '.png');
        }
        // Stock animation
        for (let i = 1 ; i < 8 ; i++) {
            this.addKeySpriteName('shipStock_' + i, './assets/upgrade/shipStock_' + i + '.png');
        }

        // Radar animation
        for (let i = 1 ; i < 6 ; i++) {
            this.addKeySpriteName('shipRadar_' + i, './assets/upgrade/shipRadar_' + i + '.png');
        }

        // smoke animation
        for (let i = 1 ; i < 8 ; i++) {
            this.addKeySpriteName('smoke_' + i, './assets/upgrade/smoke' + i + '.png');
        }

        // laser animation
        for (let i = 1 ; i < 4 ; i++) {
            this.addKeySpriteName('laserMinage' + i, './assets/laser_minage' + i + '.png');
        }


        this.onAssetsLoaded();
    }

    // Add keyname and Sprite name to the loader
    private addKeySpriteName(keyname: string, spritename: string) {
        this.tabKeyName.push(keyname);
        this.tabSpriteName.push(spritename);
    }

    // Load the loader for animation
    private onAssetsLoaded() {
        for (let i = 0 ; i < this.tabKeyName.length; i++) {
            PIXI.loader.add(this.tabKeyName[i], this.tabSpriteName[i]);
        }
        PIXI.loader.load((loader, resources) => {
            this.boolFinishLoad = true;
        });
    }
}
