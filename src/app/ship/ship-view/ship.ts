import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet, initSprite, changeSpriteInAnime } from '../../loadAnimation';
import { UserService } from '../../shared/user/user.service';
import { ChestSprite } from './chestSprite';

class UpgradeShip {
    posX: number;
    posY: number;
    currentLevel: number;
    tabLevel: Array<number>;
    tabAnimation: PIXI.extras.AnimatedSprite[];

    constructor(lvl: number, tabAnimation, posx: number, posy: number) {
        this.tabLevel = [10, 20, 40, 65, 100, 150, 170, 190, 200];
        this.tabAnimation = tabAnimation;
        this.posX = posx;
        this.posY = posy;
        this.currentLevel = lvl;
    }

    allAnimBeginOrStop(isBadConfig: boolean) {
        for (let i = 0; i < this.tabAnimation.length; i++) {
            if (isBadConfig) {
                this.tabAnimation[i].stop();
            } else {
                this.tabAnimation[i].play();
            }
        }
    }

    lvlSelection(newlvl: number) {
        for (let i = 0; i < this.tabLevel.length; i++) {
            if (newlvl <= this.tabLevel[i]) {
                return i + 1;
            }
        }
        return this.tabLevel.length;

    }

    spriteAdd(newlvl: number) {
        const lvltemp = this.lvlSelection(newlvl);
        if (newlvl === 0 || newlvl === 1 || lvltemp === this.currentLevel) {
            return null;
        }
        this.currentLevel = lvltemp;

        for (let i = 0; i < this.currentLevel; i++) {
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

    reacteurUpgrade: UpgradeShip;
    reacteurLvl: number;

    stockUpgrade: UpgradeShip;
    stockUpgradeLvl: number;
    boolNewTourelle: boolean;
    newTourelle: PIXI.extras.AnimatedSprite;
    iNewTourelle: number;

    droneUpgrade: UpgradeShip;
    currentLevelDrone: number;

    chest: ChestSprite;

    constructor(app: PIXI.Application, chestSprite: ChestSprite) {
        this.app = app;
        this.deltaSum = 0;

        this.chest = chestSprite;

        this.boolNewTourelle = false;
        this.deltaSumShip = 0;
        this.iTourelle = 1;

        // Init Sprite Animated Ship
        this.initShip();

        // init First tourelle
        this.initTourelle();

        this.currentLevelRadar = 0;

        this.radarUpgrade = this.initTabSprite(5, 'shipRadar_', this.currentLevelRadar, 500, 500, -20, 0, true);
        this.smokeRadarUpgrade = this.initTabSprite(7, 'smoke_', this.currentLevelRadar, 500, 500, -20, 0, true);

        this.reacteurLvl = 0;
        this.reacteurUpgrade = this.initTabSprite(7, 'shipEngine_', this.reacteurLvl, 500, 500, 30, 0, false);
        this.currentLevelDrone = 0;
        this.droneUpgrade = this.initTabSprite(5, 'droneUpdate_', this.currentLevelDrone, 500, 500, 30, 0, true);

        this.stockUpgradeLvl = 0;
        this.stockUpgrade = this.initTabSprite(5, 'stockage_', this.stockUpgradeLvl, 500, 500, 30, 0, true);

        this.transformShipY = this.ship.y;
        this.transformShipX = this.ship.x;


        let deltaChest = 0;
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
                this.initMoveXY(this.reacteurUpgrade, 30, 20, this.deltaSum);

                if (this.chest.boolParentChest) {
                    if (this.chest.spriteChestParent.y <= 151) {
                        this.chest.boolParentChest = false;
                        this.chest.spriteTextOpenChest.visible = false;
                    }
                    this.chest.spriteTextOpenChest.alpha -= 0.007;
                    this.chest.spriteChestParent.y = 300 - deltaChest;
                    deltaChest += 1;
                } else {
                    if (this.chest.spriteChestParent != null && this.chest.spriteChestParent.children[4].visible) {
                        this.chest.spriteChestParent.x = Math.sin(this.deltaSum * 100) * -5;
                    }
                    deltaChest = 0;
                }
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

    // init first animation Ship
    spritesheetFirstAnimation(spriteName: string, width: number, height: number, decalagex: number,
        decalagey: number, boolShipParent: boolean) {
        let spriteAnim;
        spriteAnim = initSprite(spriteName, width, height, false, false, 0.24);
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
        let spriteAnim;
        spriteAnim = initSprite(spriteName, width, height, false, false, 0.24);
        newParent.addChild(spriteAnim);
        return spriteAnim;
    }

    // Init Sprite sheet Ship
    initShip() {
        this.ship = initSprite('ship', 500, 500, true, false, 0.10);
        this.ship.loop = true;
        this.ship.x = this.app.renderer.width / 2 - 20;
        this.ship.y = this.app.renderer.height / 2;
        this.ship.texture.baseTexture.mipmap = true;
        this.ship.cacheAsBitmap = true;
        this.app.stage.addChild(this.ship);
    }

    // Tourelle init - - - - - - - -  - - - - -  - - - - - - - - - - - -  - - - - - - - - - - - - -
    initTourelle() {
        this.tourelle = initSprite('tourelle_1', 500 , 500, true, true, 0.18);
        this.tourelle.loop = false;
        this.tourelle.onComplete = () => {
            this.iTourelle = changeSpriteInAnime(this.tourelle, 'tourelle_', this.iTourelle, 4);
            this.tourelle.gotoAndPlay(0);
         };
        this.ship.addChild(this.tourelle);
    }

    initNewTourelle() {
        this.boolNewTourelle = true;
        this.iNewTourelle = 4;
        this.newTourelle = initSprite('newTourelle_4', 500 , 500, true, true, 0.15);
        this.newTourelle.loop = false;
        this.newTourelle.onComplete = () => {
            this.iNewTourelle = changeSpriteInAnime(this.newTourelle, 'newTourelle_', this.iNewTourelle, 7);
            this.newTourelle.gotoAndPlay(0);
         };
        this.ship.addChild(this.newTourelle);
    }
}
