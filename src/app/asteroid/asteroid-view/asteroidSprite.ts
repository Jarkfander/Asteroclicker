import * as PIXI from 'pixi.js';
import * as TWEEN from 'tween.js';
import * as PIXIParticles from 'pixi-particles';
import { getFramesFromSpriteSheet, initSprite } from '../../loadAnimation';
import { ParticleBase } from '../../shared/pixiVisual/particleBase';
import { IAsteroid } from '../asteroid.service';

export class AsteroidSprite {
    shakeAstey: number;
    shakeAstex: number;
    asteroid: PIXI.Sprite[];

    app: PIXI.Application;
    clickEmitter: ParticleBase;
    destructionEmitter: ParticleBase;

    checkAstero: boolean;
    checkAsteroComp: boolean;
    asteroidSeed: string;
    delta = 0;
    deltaCompteur = 0;

    xBaseAsteroid: number;
    yBaseAsteroid: number;
    compteurBoom: number;

    spriteAsteroidCarbon: PIXI.Texture[];
    boomAnim: PIXI.extras.AnimatedSprite;
    krashAnim: PIXI.extras.AnimatedSprite;
    kaboomAnim: PIXI.extras.AnimatedSprite;
    woomAnim: PIXI.extras.AnimatedSprite;
    comboWrite: PIXI.extras.AnimatedSprite;

    spriteFxContainer: PIXI.Container;

    spriteStar: PIXI.extras.AnimatedSprite;
    spriteStarXY: any;

    eventOk=0;
    spriteEventParent: PIXI.Container;
    boolEvent: boolean;
    compteurEvent: number;

    arrowFrenzy: PIXI.Sprite[];
    comboFail: PIXI.extras.AnimatedSprite;
    comboSucces: PIXI.extras.AnimatedSprite;
    comboSuccesLoop: PIXI.extras.AnimatedSprite;

    asteroidFolders;

    posXArrow: number;
    posYArrow: number;

    height: number;
    width: number;

    state: number;
    constructor(width: number, height: number, app: PIXI.Application, asteroid: IAsteroid) {
        this.height = height;
        this.width = width;
        this.app = app;
        this.eventOk = 0;
        this.compteurEvent = 0;
        this.boolEvent = false;
        this.asteroid = new Array<PIXI.Sprite>();

        this.spriteStar = initSprite('etoile_filante', 500, 172, true, true, 0.30);
        this.spriteStarXY = { x: -200, y: 800 };
        this.spriteStar.scale.set(0.5, 0.5);
        this.spriteStar.position.x = -200;
        this.spriteStar.position.y = 800;
        this.spriteStar.rotation = 100;
        this.spriteStar.loop = false;
        this.spriteStar.onComplete = () => { this.spriteStar.visible = false; };

        this.app.stage.addChild(this.spriteStar);


        // Frenzy init
        this.frenzyModInit();

        // Asteroid init
        this.asteroidFolders = {
            'carbon': new Array<PIXI.Texture>(),
            'titanium': new Array<PIXI.Texture>(),
            'iron': new Array<PIXI.Texture>(),
            'hyperium': new Array<PIXI.Texture>(),
            'gold': new Array<PIXI.Texture>(),
        };
        this.checkAstero = false;
        this.initAsteroidSprites();

        this.generateAsteroid(asteroid);

        this.InitializeClickEmitter(asteroid.ore);
        this.InitializeDestructionEmitter(asteroid.ore);
        this.compteurBoom = 0;
        this.initAnimationBoomKrash();

        this.xBaseAsteroid = this.app.renderer.width / 2;
        this.yBaseAsteroid = this.app.renderer.height / 2;

        this.spriteEventParent = new PIXI.Container();
        this.spriteEventParent.addChild(this.initAnimationFromSpriteEvent('coffre_anim1', 192, 250, true));
        this.spriteEventParent.addChild(this.initAnimationFromSpriteEvent('coffre_anim3', 192, 250, false));
        this.spriteEventParent.addChild(this.initAnimationFromSpriteEvent('explosionBulle', 350, 348, false));

        this.app.stage.addChild(this.spriteEventParent);
        this.shakeAstex = 1;
        this.shakeAstey = 1;

    }

    public shakeCoef = 100;
    tickerAppAsteroid() {
        if (this.asteroid[0]) {
            if (this.delta > 2 * Math.PI) {
                this.delta = 0;
            }
            this.delta += (2 * Math.PI) / 1000;


            this.shakeAstex = this.shakeCoef * this.delta;
            this.shakeAstey = this.delta;

            this.asteroid[0].x = this.xBaseAsteroid + Math.cos(this.shakeAstex) * -5;
            this.asteroid[0].y = this.yBaseAsteroid + Math.sin(this.shakeAstey) * -15;

            if (this.spriteStar.position.x < 1000) {
                this.spriteStar.position.x = this.spriteStarXY.x + this.delta * 2000;
                this.spriteStar.position.y = this.spriteStarXY.y - this.delta * 1800;
            } else {
                this.spriteStar.position.x = this.spriteStarXY.x;
                this.spriteStarXY.y = Math.random() * 1000 + 200;
                this.spriteStar.position.y = this.spriteStarXY.y;
                const randScal = Math.random() * 0.75 + 0.25;
                this.spriteStar.scale.set(randScal, randScal);
                this.spriteStar.visible = true,
                    this.spriteStar.gotoAndPlay(0);
            }

            if (this.boolEvent) {
                this.spriteEventParent.x += 1;
                this.spriteEventParent.y -= 1;
                if (this.spriteEventParent.x > 1500) {
                    this.boolEvent = false;
                    this.compteurEvent++;
                    if (this.compteurEvent > 3) {
                        this.eventOk = 0;
                        this.compteurEvent = 0;
                    }
                    this.activEvent();
                }
            }
        }
    }
    emitClickParticle(x: number, y: number) {
        this.clickEmitter.updateOwnerPos(x, y);
        this.clickEmitter.emit = true;
    }

    emitDestructionParticle(x: number, y: number) {
        this.destructionEmitter.updateOwnerPos(x, y);
        this.destructionEmitter.emit = true;
    }

    addSpriteToScene(sprite: PIXI.Sprite, x: number, y: number) {
        sprite.texture.baseTexture.mipmap = true;
        sprite.anchor.set(0.5);

        if (x === 0 && y === 0) {
            sprite.x = this.app.renderer.width / 2;
            sprite.y = this.app.renderer.height / 2;
            this.asteroid[0].name = 'aste';
            this.app.stage.addChildAt(sprite, 2);
        } else {
            this.asteroid[0].addChild(sprite);
            sprite.x = x;
            sprite.y = y;

        }

        sprite.interactive = true;
        sprite.buttonMode = true;
        /*sprite.on('click', (event) => {
            this.emitClickParticle(event.data);

            let tempAnim = this.boomAnim;
            let xTemp = event.data.global.x;
            const yTemp = event.data.global.y;

            const random = Math.floor(Math.random() * 4) + 1;
            if (random === 1) {
                tempAnim = this.krashAnim;
                xTemp += 50;
            } else if (random === 2) {
                tempAnim = this.kaboomAnim;
                xTemp += 50;
            } else if (random === 3) {
                tempAnim = this.woomAnim;
            }
            this.animBoomOnClick(xTemp, yTemp, tempAnim);
        });*/
    }

    clickExplosion() {
        this.emitClickParticle(this.width / 2, this.height / 2);

        let tempAnim = this.boomAnim;
        let xTemp = this.width / 2;
        const yTemp = this.height / 2;

        const random = Math.floor(Math.random() * 3);
        if (random === 0) {
            tempAnim = this.krashAnim;
            xTemp += 50;
        } else if (random === 1) {
            tempAnim = this.kaboomAnim;
            xTemp += 50;
        } else if (random === 2) {
            tempAnim = this.woomAnim;
        }
        this.animBoomOnClick(xTemp, yTemp, tempAnim,true);
    }

    initAsteroidSprites() {
        const keys = Object.keys(this.asteroidFolders);
        // tslint:disable-next-line:forin
        for (const id in keys) {
            const key = keys[id];
            this.asteroidFolders[key].push(PIXI.Texture.fromImage('assets/AsteroidSprites/' + key + '/b.png'));

            for (let spriteId = 1; spriteId <= 4; spriteId++) {
                this.asteroidFolders[key].push(PIXI.Texture.fromImage('assets/AsteroidSprites/' + key + '/' + spriteId + '.png'));
            }
        }
    }

    computeState(asteroid: IAsteroid): number {
        let state = 0;

        if ((asteroid.currentCapacity - asteroid.collectible) === asteroid.capacity) {
            state = 4;
        }
        else if (asteroid.currentCapacity - asteroid.collectible == 0) {
            state = -1;
        }
        else {
            state = Math.floor(((asteroid.currentCapacity - asteroid.collectible) / asteroid.capacity) * 5);
        }
        return state;
    }

    generateAsteroid(asteroid: IAsteroid) {
        this.state = this.computeState(asteroid);

        const seedNum = [];
        const nums = [1, 2, 3, 4];
        const comb = [[1, 1], [1, -1], [-1, -1], [-1, 1]];

        for (let i = 0; i < asteroid.seed.length; i++) {
            // tslint:disable-next-line:radix
            seedNum.push(parseInt(asteroid.seed[i]));
        }

        if (this.asteroid.length === 0) {
            this.asteroid.push(new PIXI.Sprite());
            this.asteroid.push(new PIXI.Sprite());
            this.asteroid.push(new PIXI.Sprite());
            this.asteroid.push(new PIXI.Sprite());
            this.asteroid.push(new PIXI.Sprite());
        } else {
            this.app.stage.removeChild(this.asteroid[0]);
            for (let i = 1; i < this.asteroid.length; i++) {
                this.asteroid[0].removeChild(this.asteroid[i]);
            }
        }


        this.asteroid[0].texture = this.asteroidFolders[asteroid.ore][0];

        for (let i = 0; i < this.state; i++) {
            this.asteroid[i + 1].texture = this.asteroidFolders[asteroid.ore][nums[seedNum[i]]];
        }

        if (this.state != -1) {
            this.addSpriteToScene(this.asteroid[0], 0, 0);
        }

        const offSet = 60;

        for (let i = 0; i < this.state; i++) {
            this.addSpriteToScene(this.asteroid[i + 1], comb[seedNum[i + 4]][0] * offSet, comb[seedNum[i + 4]][1] * offSet);
        }
    }

    destructOnePart() {
        if (this.asteroid[0].children.length > 0) {
            this.emitDestructionParticle(this.asteroid[0].children[this.asteroid[0].children.length - 1].worldTransform.tx,
                this.asteroid[0].children[this.asteroid[0].children.length - 1].worldTransform.ty);
            this.boomAnim.scale.set(2, 2);
            this.animBoomOnClick(this.asteroid[0].children[this.asteroid[0].children.length - 1].worldTransform.tx,
                this.asteroid[0].children[this.asteroid[0].children.length - 1].worldTransform.ty, this.boomAnim, true);
            this.boomAnim.scale.set(1, 1);
            this.asteroid[0].removeChild(this.asteroid[0].children[this.asteroid[0].children.length - 1]);
            this.state--;
        }
    }

    destructBase() {
        this.emitDestructionParticle(this.asteroid[0].worldTransform.tx,
            this.asteroid[0].worldTransform.ty);
        this.woomAnim.scale.set(4, 4);
        this.animBoomOnClick(this.asteroid[0].worldTransform.tx,
            this.asteroid[0].worldTransform.ty, this.woomAnim, true);
        this.woomAnim.scale.set(1, 1);
        this.app.stage.removeChild(this.asteroid[0]);
        this.state--;
    }
    // Change the sprite of asteroid when the user change
    changeSprite(asteroid: IAsteroid) {

        this.InitializeDestructionEmitter(asteroid.ore);
        this.InitializeClickEmitter(asteroid.ore);
        this.asteroidSeed = asteroid.seed;
        this.generateAsteroid(asteroid);
    }

    InitializeClickEmitter(asteroidType: string) {
        const config = {
            'alpha': {
                'start': 1,
                'end': 1
            },
            'scale': {
                'start': 1,
                'end': 0
            },
            'color': {
                'start': 'ffffff',
                'end': 'ffffff'
            },
            'speed': {
                'start': 300,
                'end': 100
            },
            'startRotation': {
                'min': 0,
                'max': 360
            },
            'rotationSpeed': {
                'min': 1000,
                'max': 1000
            },
            'lifetime': {
                'min': 0.5,
                'max': 0.5
            },
            'frequency': 0.008,
            'emitterLifetime': 0.20,
            'maxParticles': 20,
            'pos': {
                'x': 0,
                'y': 0
            },
            'addAtBack': false,
            'spawnType': 'circle',
            'spawnCircle': {
                'x': 0,
                'y': 0,
                'r': 0
            }
        };

        this.clickEmitter = new ParticleBase(
            this.app.stage,
            PIXI.Texture.fromImage('assets/AsteroidParticle/' + asteroidType + 'Particle.png'),
            config
        );
    }

    InitializeDestructionEmitter(asteroidType: string) {
        const config = {
            'alpha': {
                'start': 1,
                'end': 1
            },
            'scale': {
                'start': 0.8,
                'end': 0
            },
            'color': {
                'start': 'ffffff',
                'end': 'ffffff'
            },
            'speed': {
                'start': 300,
                'end': 100
            },
            'startRotation': {
                'min': 0,
                'max': 360
            },
            'rotationSpeed': {
                'min': 1000,
                'max': 1000
            },
            'lifetime': {
                'min': 1,
                'max': 1
            },
            'frequency': 0.008,
            'emitterLifetime': 0.2,
            'maxParticles': 10,
            'pos': {
                'x': 0,
                'y': 0
            },
            'addAtBack': false,
            'spawnType': 'circle',
            'spawnCircle': {
                'x': 0,
                'y': 0,
                'r': 0
            }
        };

        this.destructionEmitter = new ParticleBase(
            this.app.stage,
            PIXI.Texture.fromImage('assets/AsteroidParticle/' + asteroidType + 'Particle.png'),
            config
        );
    }

    // init the position and the scale of spriteSheet
    initAnimScaleAndAnchor(tempAnim: PIXI.extras.AnimatedSprite) {
        tempAnim.anchor.set(0.5, 0.04);
        tempAnim.scale.set(1, 1);
        tempAnim.loop = false;
        this.app.stage.addChildAt(tempAnim, 4);
    }

    // Init Boom Krash kAboom ... the spriteSheet anim
    initAnimationBoomKrash() {
        this.boomAnim = initSprite('Boum', 236, 236, false, false, 0.36);
        this.initAnimScaleAndAnchor(this.boomAnim);

        this.krashAnim = initSprite('krash', 236, 236, false, false, 0.35);
        this.initAnimScaleAndAnchor(this.krashAnim);

        this.kaboomAnim = initSprite('kaboom', 236, 236, false, false, 0.28);
        this.initAnimScaleAndAnchor(this.kaboomAnim);

        this.woomAnim = initSprite('woom', 236, 236, false, false, 0.28);
        this.initAnimScaleAndAnchor(this.woomAnim);

        this.comboWrite = initSprite('comboWrite', 500, 500, false, false, 0.28);
        this.initAnimScaleAndAnchor(this.comboWrite);
    }

    // When you click put a random animation
    animBoomOnClick(x: number, y: number, pixiAnimate: PIXI.extras.AnimatedSprite, boolForce = false) {
        if (this.compteurBoom % 25 === 0 || boolForce) {
            this.compteurBoom = 1 + Math.floor(Math.random() * 12);
            pixiAnimate.position.set(x + 50, y - 100);
            pixiAnimate.visible = true;
            pixiAnimate.gotoAndPlay(0);
            pixiAnimate.onComplete = () => {
                pixiAnimate.visible = false;
            };
        } else {
            this.compteurBoom++;
        }
    }

    // Animation on click fx in border
    initAnimationFxClick(w: number, h: number) {
        this.spriteFxContainer = new PIXI.Container();
        this.spriteFxContainer.width = w;
        this.spriteFxContainer.height = h;

        this.spriteFxContainer.addChild(this.initAnimationFromSpriteName('fxClick_1', 500, 500, w, h, false));
        this.spriteFxContainer.addChild(this.initAnimationFromSpriteName('fxClick_2', 500, 500, w, h, true));
        this.spriteFxContainer.addChild(this.initAnimationFromSpriteName('fxClick_3', 500, 500, w, h, false));
        this.app.stage.addChild(this.spriteFxContainer);
    }

    startAnimFx() {
        const tempSprite: any = this.spriteFxContainer.children;
        tempSprite[0].visible = true;
        tempSprite[0].gotoAndPlay(0);
        tempSprite[0].onComplete = () => {
            tempSprite[0].visible = false;
            tempSprite[1].gotoAndPlay(0);
            tempSprite[1].visible = true;
        };
    }

    endAnimFx() {
        const tempSprite: any = this.spriteFxContainer.children;
        tempSprite[1].loop = false;
        tempSprite[1].onComplete = () => {
            tempSprite[1].visible = false;
            tempSprite[2].gotoAndPlay(0);
            tempSprite[2].visible = true;
            tempSprite[2].onComplete = () => {
                tempSprite[2].visible = false;
                tempSprite[1].loop = true;
            };
        };
    }

    // Init the fxClick 1 2 and 3
    initAnimationFromSpriteName(spriteName, w, h, wSize, hSize, isLoop) {
        const tempAnim = initSprite(spriteName, w, h, false, true, 0.25);
        tempAnim.alpha = 0.25;
        tempAnim.loop = isLoop;
        tempAnim.texture.baseTexture.mipmap = true;
        tempAnim.width = wSize;
        tempAnim.height = hSize;
        return tempAnim;
    }

    // Event ==>
    activEvent() {
        if (this.eventOk === 1) {
            this.boolEvent = true;
            this.spriteEventParent.children[0].visible = true;
            this.spriteEventParent.children[1].visible = false;
            this.spriteEventParent.children[2].visible = false;
            this.spriteEventParent.x = -100;
            this.spriteEventParent.y = 650;
        }
    }

    // init animation event
    initAnimationFromSpriteEvent(spriteName, w, h, isLoop) {
        const tempAnim = initSprite(spriteName, w, h, false, true);
        tempAnim.loop = isLoop;
        tempAnim.texture.baseTexture.mipmap = true;
        tempAnim.scale.set(0.25);
        tempAnim.rotation = 45;
        return tempAnim;
    }

    // Frenzy mod - - - - - - - - - - - - - - - -
    frenzyModTouch(numTouch: number) {
        this.frenzyModTouchDown();
        if (this.asteroid[0].visible) {
            const randomX = Math.floor(Math.random() * 150) - 150;
            const randomY = Math.floor(Math.random() * 150) - 150;

            this.posXArrow = this.xBaseAsteroid + randomX;
            this.posYArrow = this.yBaseAsteroid + randomY;
            this.arrowFrenzy[numTouch].position.set(this.posXArrow, this.posYArrow);
            this.arrowFrenzy[numTouch].visible = true;
        }

    }

    frenzyModTouchDown() {
        for (let i = 0; i < 4; i++) {
            if (this.arrowFrenzy[i].visible) {
                this.emitDestructionParticle(this.arrowFrenzy[i].worldTransform.tx,
                    this.arrowFrenzy[i].worldTransform.ty);
                /*this.animBoomOnClick(this.arrowFrenzy[i].worldTransform.tx,
                    this.arrowFrenzy[i].worldTransform.ty, this.comboWrite, true);*/
                this.checkAstero = true;
            }
            this.arrowFrenzy[i].visible = false;
        }
    }

    frenzyModInit() {
        this.arrowFrenzy = new Array<PIXI.Sprite>();
        for (let i = 0; i < 4; i++) {
            this.arrowFrenzy.push(PIXI.Sprite.fromImage('assets/frenzy/arrow' + i + '.png'));
            this.arrowFrenzy[i].visible = false;
            this.arrowFrenzy[i].scale.set(0.5, 0.5);
            this.app.stage.addChild(this.arrowFrenzy[i]);
        }

        this.comboFail = initSprite('comboFail', 500, 500, false, false, 0.30);
        this.comboSucces = initSprite('intro_combo', 500, 500, false, false, 0.30);
        this.comboSuccesLoop = initSprite('loop_combo', 500, 500, false, false, 0.30);
        this.comboSuccesLoop.loop = true;
        this.comboFail.loop = false;
        this.comboSucces.loop = false;
        this.comboFail.width = this.width;
        this.comboFail.height = this.height;
        this.comboFail.position.set(this.width / 2, this.height / 2);
        this.comboSuccesLoop.width = this.width;
        this.comboSuccesLoop.height = this.height;
        this.comboSuccesLoop.position.set(this.width / 2, this.height / 2);
        this.comboSucces.position.set(this.width / 2, this.height / 2);

        this.comboSuccesLoop.name = 'combotSuccesLoop';

        this.app.stage.addChild(this.comboSucces);
        this.app.stage.addChildAt(this.comboSuccesLoop, 1);
        this.app.stage.addChild(this.comboFail);
    }

    // finish the combo mod
    frenzyModComboFinish() {
        if (this.comboSuccesLoop.visible) {
            this.animBoomOnClick(this.xBaseAsteroid, this.yBaseAsteroid, this.comboWrite, true);
        }
        this.comboSucces.visible = false;
        this.comboSuccesLoop.visible = false;
    }

    frenzyFail() {
        this.comboFail.visible = true;
        this.comboFail.gotoAndPlay(0);
        this.comboFail.onComplete = () => {
            this.comboFail.visible = false;
        };
        this.comboSucces.visible = false;
        this.comboSuccesLoop.visible = false;
        this.frenzyModComboFinish();
    }
    frenzyBackgroundStart() {
        this.comboSucces.visible = true;
        this.comboSucces.gotoAndPlay(0);
        this.comboSucces.onComplete = () => {
            this.comboSuccesLoop.visible = true;
            this.comboSuccesLoop.gotoAndPlay(0);
            this.comboSucces.visible = false;
        };
    }

}
