import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet } from '../../loadAnimation';
class UpgradeShip {
    posX: number;
    posY: number;
    scaleX: number;
    scaleY: number;
    currentLevel: number;
    tabAnimation: PIXI.extras.AnimatedSprite[];

    constructor(lvl: number, tabAnimation, posx: number, posy: number, scalx: number, scaly: number) {
        this.tabAnimation = tabAnimation;
        this.posX = posx;
        this.posY = posy;
        this.scaleX = scalx;
        this.scaleY = scaly;
        this.currentLevel = lvl;
    }

    spriteAdd(newlvl: number) {
        const lvlModulo = newlvl; // ; (newlvl <= 5 ? 1 : Math.floor(newlvl / 5) + 1);
        if (newlvl === 0 || lvlModulo === this.currentLevel) {
            return null;
        }
        this.currentLevel = lvlModulo;

        for (let i = 0 ; i < this.currentLevel + 1 ; i++) {
            if (!this.tabAnimation[i]) {
                break;
            }
            this.tabAnimation[i].visible = true;
        }
    }
}

export class Ship {
    ship: PIXI.extras.AnimatedSprite;
    app: PIXI.Application;

    radarUpgrade: UpgradeShip;
    currentLevelRadar: number;
    smokeRadarUpgrade: UpgradeShip;

    stockUpgrade: UpgradeShip;
    currentLevelStock: number;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.initShip('ship', 500, 500);

        this.currentLevelRadar = 0;
        this.radarUpgrade = this.initTabSprite(5, 'shipRadar_', this.currentLevelRadar, 500, 500, -20, 0);
        this.smokeRadarUpgrade = this.initTabSprite(7, 'smoke_', this.currentLevelRadar, 500, 500, -20, 0);

        this.currentLevelStock = 0;
        this.stockUpgrade = this.initTabSprite(7, 'shipStock_', this.currentLevelStock, 500, 500, 30, 0);

    }

    // init sprite for upgrade ship
    initTabSprite(nbMaxSprite: number, nameSprite: string, lvl: number, width: number,
         height: number, decalagex: number, decalagey: number) {
        const temp = [];
        for (let i = 0; i < nbMaxSprite; i++) {
            temp.push(this.spritesheetAnimation(nameSprite + (i + 1), width, height, decalagex, decalagey));
        }
        return new UpgradeShip(lvl, temp, 1, 1, 1, 1);
    }

    // manage the upgrade when the level change
    autoUpgrade(lvl: number, tab: UpgradeShip) {
         tab.spriteAdd(lvl);
    }

    spritesheetAnimation(spriteName: string, width: number, height: number, decalagex: number, decalagey: number) {
        const spriteAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, width, height));
        spriteAnim.gotoAndPlay(0);
        spriteAnim.animationSpeed = 0.24;
        spriteAnim.visible = false;
        spriteAnim.anchor.set(0.5);

        spriteAnim.x = this.app.renderer.width / 2  + decalagex;
        spriteAnim.y = this.app.renderer.height / 2 + decalagey;
        this.app.stage.addChild(spriteAnim);
        return spriteAnim;
    }

    initShip(spriteName: string, width: number, height: number) {
        this.ship = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, width, height));
        this.ship.gotoAndPlay(0);
        this.ship.animationSpeed = 0.10;
        this.ship.visible = true;
        this.ship.texture.baseTexture.mipmap = true;
        this.ship.anchor.set(0.5);

        this.ship.x = this.app.renderer.width / 2 - 20;
        this.ship.y = this.app.renderer.height / 2 ;

        this.app.stage.addChild(this.ship);
    }

}
