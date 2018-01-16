import * as PIXI from 'pixi.js';
import { getFramesFromSpriteSheet, initSprite, changeSpriteInAnime } from '../../loadAnimation';

export class ChestSprite {

    spriteChestParent: PIXI.Container;
    spriteTextOpenChest: PIXI.Sprite;
    boolParentChest: boolean;
    spriteTextChest: PIXI.Container;
    numberOfChest: number;
    app: PIXI.Application;

    spriteBoolText: boolean;
    constructor(app, numberOfChest) {
        this.app = app;
        // Init the font 
        const text = new PIXI.Text(' ',
            {
                fontFamily: 'Montserrat-Black',
                fontSize: '1px'
            });

        this.app.stage.addChild(text);

        this.numberOfChest = numberOfChest;

        // Text new chest
        this.spriteTextOpenChest = PIXI.Sprite.fromImage('../../assets/capsule/youHaveNew.png');
        this.spriteTextOpenChest.visible = false;
        this.spriteTextOpenChest.anchor.set(0.5);
        this.spriteTextOpenChest.scale.set(1.25);
        this.spriteTextOpenChest.x = app.renderer.width / 2;
        this.spriteTextOpenChest.y = app.renderer.height / 2 + 100;
        this.spriteBoolText = true;
        this.boolParentChest = false;
    }

    afterInitShip() {
        this.initFirstChest();
        this.initChest();
    }

    // init the chest
    public initFirstChest() {
        this.spriteChestParent = new PIXI.Container();
        this.spriteChestParent.x = 0;
        this.spriteChestParent.y = 300;
        this.initAnimationChest();
    }
    // init all of chest
    initChest() {
        if (this.numberOfChest > 0) {
            this.spriteTextChest = new PIXI.Container();
            this.spriteChestParent.y = 300;
            this.boolParentChest = true;
            if (this.spriteBoolText) {
                this.app.stage.addChildAt(this.spriteTextOpenChest, this.app.stage.children.length - 1);
                this.spriteBoolText = false;
            }
            this.spriteTextOpenChest.visible = true;
            this.spriteTextOpenChest.alpha = 1;
            this.spriteChestParent.children[0].visible = true;
        }
    }

    // remove chest for initChest
    supChest() {
        if (this.spriteChestParent) {
            for (let i = 0; i < this.spriteChestParent.children.length; i++) {
                this.spriteChestParent.children[i].visible = false;
            }
            if (this.spriteTextChest) {
                this.spriteTextChest.destroy();
            }
            this.initChest();
        }
    }

    openChestText(i, x, y, textString: string, values) {
        const sprite = PIXI.Sprite.fromImage('./assets/oreIcon/' + textString + 'Icon.png');
        if (textString === 'iron') {
            textString = 'IRON';
        } else {
            textString = textString.toUpperCase();
        }
        const text = new PIXI.Text(textString + ' :\n' + values,
            {
                fontFamily: 'Montserrat-Black',
                fontSize: 8, fill: 0x0000000,
                align: 'center'
            });
        text.x += x + 2;
        text.y += y;

        if (textString === 'CREDIT') {
            sprite.x += 15;
        }
        sprite.x += x;
        sprite.y += y - 20;
        sprite.scale.set(0.15);

        this.spriteTextChest.addChild(sprite);
        this.spriteTextChest.addChild(text);
    }


    initAnimationChest() {
        this.spriteChestParent.addChild(this.initAnimationFromSpriteName('coffre_anim1', 192, 250, true));
        this.spriteChestParent.addChild(this.initAnimationFromSpriteName('coffre_anim2', 192, 250, false));
        this.spriteChestParent.addChild(this.initAnimationFromSpriteName('coffre_anim3', 192, 250, false));
        this.spriteChestParent.addChild(this.initAnimationFromSpriteName('bulle1', 250, 162, false));
        this.initBull(3);
        this.spriteChestParent.addChild(this.initAnimationFromSpriteName('bulle2', 250, 162, false));
        this.initBull(4);
        this.spriteChestParent.addChild(this.initAnimationFromSpriteName('explosionBulle', 350, 348, false));
    }

    initBull(i: number) {
        const temp: any = this.spriteChestParent.children[i];
        temp.animationSpeed = 0.50;
        temp.anchor.set(0.5);
        temp.scale.set(1);
        temp.y = -100;
    }

    initAnimationFromSpriteName(spriteName, w, h, isLoop) {
        const tempAnim = initSprite(spriteName, w, h, false, true);
        tempAnim.loop = isLoop;
        tempAnim.texture.baseTexture.mipmap = true;
        tempAnim.scale.set(0.50);
        return tempAnim;
    }

}
