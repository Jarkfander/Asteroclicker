import * as PIXI from 'pixi.js';

class UpgradeShip {
    tabUpgrade = [];
    posX: number;
    posY: number;
    scaleX: number;
    scaleY: number;
    currentLevel: number;

    constructor(lvl: number, tabSprite, posx: number, posy: number, scalx: number, scaly: number) {
        this.tabUpgrade = tabSprite;
        this.posX = posx;
        this.posY = posy;
        this.scaleX = scalx;
        this.scaleY = scaly;
        this.currentLevel = lvl;
    }

    spriteAdd(newlvl: number) {
        this.currentLevel = newlvl;
        if (this.tabUpgrade[this.currentLevel] === null) {
            return this.tabUpgrade[this.tabUpgrade.length - 1];
        }
        if (this.currentLevel === 0) {
            return null;
        } else {
            const upg = this.tabUpgrade[this.currentLevel - 1];
            upg.texture.baseTexture.mipmap = true;
            upg.scale.set(this.scaleX, this.scaleY);
            upg.anchor.set(0.5);
            return upg;
        }

    }
}

export class Ship {
    ship: PIXI.Sprite;
    app: PIXI.Application;

    radarUpgrade: UpgradeShip;
    currentLevelRadar: number;

    constructor(x: number , y: number, app: PIXI.Application) {
        this.app = app;
        this.ship = PIXI.Sprite.fromImage('assets/vaisseau_part1.png');
        this.ship.texture.baseTexture.mipmap = true;
        this.ship.anchor.set(0.5);
        this.ship.scale.set(x, y);

        this.ship.x = this.app.renderer.width / 2;
        this.ship.y = this.app.renderer.height / 2;
        this.app.stage.addChild(this.ship);

        this.currentLevelRadar = 0;

        this.initTabSprite(1, 'assets/shipRadar_');
        this.autoUpgrade(0, this.radarUpgrade);
    }

    // init sprite for upgrade ship
    initTabSprite(nbMaxSprite: number, nameSprite: string) {
        const temp = [];
        for (let i = 0; i < nbMaxSprite ; i++) {
            temp.push(PIXI.Sprite.fromImage(nameSprite + i + '.png'));
        }
        this.radarUpgrade = new UpgradeShip(this.currentLevelRadar, temp, 1, 1, 1, 1);
    }

    // manage the upgrade when the level change
    autoUpgrade(lvl: number, tab) {
        const sprite = this.radarUpgrade.spriteAdd(lvl);
        if (sprite) {
            this.ship.addChild(sprite);
        }
    }
}
