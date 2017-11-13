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
        if (newlvl === 0  ||  (newlvl <= 5 ? 1 : Math.floor(newlvl / 5) + 1) === this.currentLevel) {
            return null;
        }

        this.currentLevel = newlvl <= 5 ? 1 : Math.floor(newlvl / 5) + 1;
        const upg = this.tabUpgrade[this.currentLevel - 1];
        upg.texture.baseTexture.mipmap = true;
        upg.scale.set(this.scaleX, this.scaleY);
        upg.anchor.set(0.5);
        return upg;
    }
}

export class Ship {
    ship: PIXI.Sprite;
    app: PIXI.Application;

    radarUpgrade: UpgradeShip;
    currentLevelRadar: number;

    stockUpgrade: UpgradeShip;
    currentLevelStock: number;

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
        this.radarUpgrade = this.initTabSprite(3, 'assets/upgrade/shipRadar_', this.currentLevelRadar);
        this.autoUpgrade(0, this.radarUpgrade);

        this.currentLevelStock = 0;
        this.stockUpgrade = this.initTabSprite(3, 'assets/upgrade/shipStock_', this.currentLevelStock);
        this.autoUpgrade(0, this.stockUpgrade);
    }

    // init sprite for upgrade ship
    initTabSprite(nbMaxSprite: number, nameSprite: string, lvl: number) {
        const temp = [];
        for (let i = 0; i < nbMaxSprite ; i++) {
            temp.push(PIXI.Sprite.fromImage(nameSprite + (i + 1) + '.png'));
        }
        return new UpgradeShip(lvl, temp, 1, 1, 1, 1);
    }

    // manage the upgrade when the level change
    autoUpgrade(lvl: number, tab: UpgradeShip) {
        const sprite = tab.spriteAdd(lvl);
        if (sprite) {
            this.ship.addChild(sprite);
        }
    }
}
