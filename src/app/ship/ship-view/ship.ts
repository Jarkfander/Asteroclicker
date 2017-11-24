import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet } from '../../loadAnimation';
class UpgradeShip {
    posX: number;
    posY: number;
    currentLevel: number;
    tabAnimation: PIXI.extras.AnimatedSprite[];

    constructor(lvl: number, tabAnimation, posx: number, posy: number) {
        this.tabAnimation = tabAnimation;
        this.posX = posx;
        this.posY = posy;
        this.currentLevel = lvl;
    }

    spriteAdd(newlvl: number) {
        const lvlModulo = (newlvl <= 5 ? 1 : Math.floor(newlvl / 5) + 1);
        if (newlvl === 0 || lvlModulo === this.currentLevel) {
            return null;
        }
        this.currentLevel = lvlModulo;

        for (let i = 0; i < this.currentLevel + 1; i++) {
            if (!this.tabAnimation[i]) {
                break;
            }
            this.tabAnimation[i].visible = true;
        }
    }
}

export class Ship {
    ship: PIXI.extras.AnimatedSprite;
    tourelle: PIXI.extras.AnimatedSprite;
    iTourelle: number;

    transformShipY: number;
    transformShipX: number;
    deltaSumShip: number;
    deltaSum: number;

    app: PIXI.Application;

    radarUpgrade: UpgradeShip;
    currentLevelRadar: number;
    smokeRadarUpgrade: UpgradeShip;

    stockUpgrade: UpgradeShip;
    currentLevelStock: number;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.deltaSum = 0;

        this.deltaSumShip = 0;
        this.iTourelle = 1;
        this.initShip('ship', 500, 500);
        this.initTourelle('tourelle_1', 500, 500);

        this.currentLevelRadar = 0;

        this.radarUpgrade = this.initTabSprite(5, 'shipRadar_', this.currentLevelRadar, 500, 500, -20, 0, true);
        this.smokeRadarUpgrade = this.initTabSprite(7, 'smoke_', this.currentLevelRadar, 500, 500, -20, 0, true);

        this.currentLevelStock = 0;
        this.stockUpgrade = this.initTabSprite(7, 'shipStock_', this.currentLevelStock, 500, 500, 30, 0, false);

        this.transformShipY = this.ship.y;
        this.transformShipX = this.ship.x;

        // Listen for animate update
        this.app.ticker.add((delta) => {
            if (this.ship) {
                if (this.deltaSum > 2 * Math.PI) {
                    this.deltaSum = 0;
                }
                this.deltaSum += (2 * Math.PI) / 2500;

                if (this.deltaSumShip > 2 * Math.PI) {
                    this.deltaSumShip = 0;
                }
                this.deltaSumShip += (2 * Math.PI) / 1500;

                this.ship.y = this.transformShipY + Math.sin(this.deltaSumShip) * 17;
                this.ship.x = this.transformShipX + Math.cos(this.deltaSumShip) * 5;
                this.initMoveXY(this.stockUpgrade, 30, 20, this.deltaSum);
            

            }
        });


    }
    // Move the ship each tick 
    initMoveXY(upgradeAnimation, xVariation: number, yVariation: number, multiplicateurDetlta: number) {
        upgradeAnimation.tabAnimation[0].y = upgradeAnimation.posY + Math.sin(multiplicateurDetlta) * yVariation;
        upgradeAnimation.tabAnimation[0].x = upgradeAnimation.posX + Math.cos(multiplicateurDetlta) * xVariation;
    }

    // init sprite for upgrade ship
    initTabSprite(nbMaxSprite: number, nameSprite: string, lvl: number, width: number,
        height: number, decalagex: number, decalagey: number, boolShipParent: boolean) {
        const temp = [];
        temp.push(this.spritesheetFirstAnimation(nameSprite + 1, width, height, decalagex, decalagey, boolShipParent));
        for (let i = 1; i < nbMaxSprite; i++) {
            temp.push(this.spritesheetAnimation(nameSprite + (i + 1), width, height, decalagex, decalagey, temp[0]));
        }
        return new UpgradeShip(lvl, temp, temp[0].x, temp[0].y);
    }

    // manage the upgrade when the level change
    autoUpgrade(lvl: number, tab: UpgradeShip) {
        tab.spriteAdd(lvl);
    }

    spritesheetFirstAnimation(spriteName: string, width: number, height: number, decalagex: number,
         decalagey: number, boolShipParent: boolean) {
        const spriteAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, width, height));
        spriteAnim.gotoAndPlay(0);
        spriteAnim.animationSpeed = 0.24;
        spriteAnim.visible = false;
        spriteAnim.anchor.set(0.5);

        if (boolShipParent) {
            this.ship.addChild(spriteAnim);
        } else {
            spriteAnim.x = this.app.renderer.width / 2 - decalagex;
            spriteAnim.y = this.app.renderer.height / 2 - decalagey;
            this.app.stage.addChild(spriteAnim);
        }

        return spriteAnim;
    }

    spritesheetAnimation(spriteName: string, width: number, height: number, decalagex, decalagey, newParent) {
        const spriteAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, width, height));
        spriteAnim.gotoAndPlay(0);
        spriteAnim.animationSpeed = 0.24;
        spriteAnim.visible = false;
        spriteAnim.anchor.set(0.5);

        newParent.addChild(spriteAnim);
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
        this.ship.y = this.app.renderer.height / 2;

        this.app.stage.addChild(this.ship);
    }

    initTourelle(spriteName: string, width: number, height: number) {
        this.tourelle = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, width, height));
        this.tourelle.gotoAndPlay(0);
        this.tourelle.animationSpeed = 0.18;
        this.tourelle.loop = false;
        this.tourelle.visible = true;
        this.tourelle.texture.baseTexture.mipmap = true;
        this.tourelle.anchor.set(0.5);
        this.tourelle.onComplete = () => { this.changeTourelleSprite(); };
        this.ship.addChild(this.tourelle);
    }

    changeTourelleSprite() {
        this.iTourelle = ((this.iTourelle + 1) % 4) === 0 ? 1 : ((this.iTourelle + 1) % 4);
        const stringTourelle: string = 'tourelle_' + this.iTourelle;

        const tempTourelle = getFramesFromSpriteSheet(PIXI.loader.resources[stringTourelle].texture, 500, 500);

        for ( let i = 0 ; i < this.tourelle.textures.length ; i++) {
            this.tourelle.textures[i] = tempTourelle[i];
        }
        this.tourelle.gotoAndPlay(0);
    }
}
