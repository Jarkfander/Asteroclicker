import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet } from '../../loadAnimation';
import { UserService } from '../../shared/user/user.service';
class UpgradeShip {
    posX: number;
    posY: number;
    currentLevel: number;
    tabLevel: Array<number>;
    tabAnimation: PIXI.extras.AnimatedSprite[];

    constructor(lvl: number, tabAnimation, posx: number, posy: number) {
        this.tabLevel = [10, 20, 40, 65, 100, 150];
        this.tabAnimation = tabAnimation;
        this.posX = posx;
        this.posY = posy;
        this.currentLevel = lvl;
    }

    lvlSelection(newlvl: number) {
        for (let i = 0; i < this.tabLevel.length; i++) {
            if (newlvl <= this.tabLevel[i]) {
                return i + 1;
            }
        }

    }

    spriteAdd(newlvl: number) {
        const lvltemp = this.lvlSelection(newlvl);
        if (newlvl === 0 || lvltemp === this.currentLevel) {
            return null;
        }
        this.currentLevel = lvltemp;

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

    spriteChest: PIXI.extras.AnimatedSprite;
    spriteChestParent: PIXI.Container;
    spriteChestTab: Array<PIXI.extras.AnimatedSprite>;
    spriteTextChest: PIXI.Container;
    numberOfChest: number;

    app: PIXI.Application;

    radarUpgrade: UpgradeShip;
    currentLevelRadar: number;
    smokeRadarUpgrade: UpgradeShip;

    reacteur: UpgradeShip;
    reacteurLvl: number;

    stockUpgrade: UpgradeShip;
    stockUpgradeLvl: number;
    boolNewTourelle: boolean;
    newTourelle: PIXI.extras.AnimatedSprite;
    iNewTourelle: number;

    droneUpgrade: UpgradeShip;
    currentLevelDrone: number;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.deltaSum = 0;

        this.boolNewTourelle = false;

        this.deltaSumShip = 0;
        this.iTourelle = 1;

        this.initShip('ship', 500, 500);
        this.initTourelle('tourelle_1', 500, 500);

        this.currentLevelRadar = 0;

        this.radarUpgrade = this.initTabSprite(5, 'shipRadar_', this.currentLevelRadar, 500, 500, -20, 0, true);
        this.smokeRadarUpgrade = this.initTabSprite(7, 'smoke_', this.currentLevelRadar, 500, 500, -20, 0, true);

        this.reacteurLvl = 0;
        this.reacteur = this.initTabSprite(7, 'shipReacteur_', this.reacteurLvl, 500, 500, 30, 0, false);

        this.currentLevelDrone = 0;
        this.droneUpgrade = this.initTabSprite(5, 'droneUpdate_', this.currentLevelDrone, 500, 500, 30, 0, true);

        this.stockUpgradeLvl = 0;
        this.stockUpgrade = this.initTabSprite(1, 'stockage_', this.stockUpgradeLvl, 500, 500, 30, 0, true);

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
                this.initMoveXY(this.reacteur, 30, 20, this.deltaSum);

                // this.spriteChestParent.x = Math.sin(this.deltaSum * 100) * -5;
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

    // initial ship animated Sprite
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

    // First Tourelle
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

    // Change tourelle
    changeTourelleSprite() {
        this.iTourelle = ((this.iTourelle + 1) % 4) === 0 ? 1 : ((this.iTourelle + 1) % 4);
        const stringTourelle: string = 'tourelle_' + this.iTourelle;

        const tempTourelle = getFramesFromSpriteSheet(PIXI.loader.resources[stringTourelle].texture, 500, 500);

        for (let i = 0; i < this.tourelle.textures.length; i++) {
            this.tourelle.textures[i] = tempTourelle[i];
        }
        this.tourelle.gotoAndPlay(0);
    }

    initNewTourelle(spriteName: string, width: number, height: number) {
        this.boolNewTourelle = true;
        this.newTourelle = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, width, height));
        this.newTourelle.gotoAndPlay(0);
        this.newTourelle.animationSpeed = 0.15;
        this.newTourelle.loop = false;
        this.newTourelle.visible = true;
        this.newTourelle.texture.baseTexture.mipmap = true;
        this.newTourelle.anchor.set(0.5);
        this.newTourelle.onComplete = () => { this.changeNewTourelleSprite(); };
        this.ship.addChild(this.newTourelle);
    }

    // Change tourelle
    changeNewTourelleSprite() {
        this.iNewTourelle = ((this.iNewTourelle + 1) % 7) === 0 ? 1 : ((this.iNewTourelle + 1) % 7);
        const stringTourelle: string = 'newTourelle_' + this.iNewTourelle;

        const tempTourelle = getFramesFromSpriteSheet(PIXI.loader.resources[stringTourelle].texture, 500, 500);

        for (let i = 0; i < this.newTourelle.textures.length; i++) {
            this.newTourelle.textures[i] = tempTourelle[i];
        }
        this.newTourelle.gotoAndPlay(0);
    }

    // Chest managed - - - - - - - -- - - - - - - -- - -
    initAnimatedChest() {
        const spriteChest = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources['coffre_anim1'].texture, 192, 250));
        spriteChest.gotoAndPlay(0);
        spriteChest.animationSpeed = 0.35;
        spriteChest.texture.baseTexture.mipmap = true;
        spriteChest.visible = true;
        spriteChest.anchor.set(0.5);
        spriteChest.scale.set(0.45);
        return spriteChest;
    }

    initAnimatedChestOpen(spriteName, w, h) {
        const spriteChest = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, w, h)); 
        spriteChest.gotoAndPlay(0);
        spriteChest.animationSpeed = 0.35;
        spriteChest.loop = false;
        spriteChest.texture.baseTexture.mipmap = true;
        spriteChest.visible = true;
        spriteChest.anchor.set(0.5);
        return spriteChest;
    }

     initBulle(bulleName) {
        const bulle = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[bulleName].texture, 250, 162));
        bulle.gotoAndPlay(0);
        bulle.animationSpeed = 0.50;
        bulle.texture.baseTexture.mipmap = true;
        bulle.visible = true;
        bulle.loop = false;
        bulle.anchor.set(0.5);
        bulle.scale.set(3);
        bulle.y = -225;
        return bulle;
    }

    animatedBulleOpen(i: number, bulleName) {
        if (bulleName === 'bulle2') {
            this.spriteChestTab[i].children[0].visible = false;
        }
        return this.spriteChestTab[i].addChild(this.initBulle(bulleName));
    }

    // init all of chest
    initChest() {
        this.spriteChestParent = new PIXI.Container();
        this.spriteTextChest = new PIXI.Container();
        this.spriteChestTab = new Array<PIXI.extras.AnimatedSprite>();
        this.ship.addChildAt(this.spriteChestParent, 5);
        if (this.numberOfChest > 0) {
            this.spriteChestTab.push(this.initAnimatedChest());
            this.spriteChestTab[0].x = 0;
            this.spriteChestTab[0].y = 150;
            this.spriteChestParent.addChild(this.spriteChestTab[0]);
        }
    }

    // remove chest for initChest
    supChest() {
        for (let i = 0; i < this.spriteChestParent.children.length; i++) {
            this.spriteChestParent.removeChildAt(i);
        }
        delete this.spriteChestTab;
        this.spriteChestParent.destroy();
        this.initChest();
    }

    animatedChestOpen(i: number, spriteName, w, h) {

        return this.spriteChestTab[i].addChild(this.initAnimatedChestOpen(spriteName, w, h));
    }

    openChest(i, x, y, textString: string, values) {
        const sprite = PIXI.Sprite.fromImage('./assets/oreIcon/' + textString + 'Icon.png');
        if (textString === 'fer') {
            textString = 'IRON';
        } else {
            textString = textString.toUpperCase();
        }
        const text = new PIXI.Text(textString +  ' :\n' + values,
         { fontFamily: 'Montserrat-Black', fontSize: 23, fill: 0x0000000, align: 'center' });
        text.x += x;
        text.y += y;

        if (textString === 'CREDIT') {
            sprite.x += 20;
        }
        sprite.x += x;
        sprite.y += y + 75;
        sprite.scale.set(0.40);

        this.spriteTextChest.addChild(sprite);
        this.spriteTextChest.addChild(text);
    }

}
