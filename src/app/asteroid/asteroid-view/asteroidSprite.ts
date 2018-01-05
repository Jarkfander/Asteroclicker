import * as PIXI from 'pixi.js';
import * as TWEEN from 'tween.js';
import * as PIXIParticles from 'pixi-particles';
import { getFramesFromSpriteSheet } from '../../loadAnimation';
import { ParticleBase } from '../../shared/pixiVisual/particleBase';
import { Asteroid } from './asteroid';

export class AsteroidSprite {
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

    spriteFxContainer: PIXI.Container;

    eventOk: number;
    spriteEventParent: PIXI.Container;
    boolEvent: boolean;
    compteurEvent: number;

    arrowFrenzy: PIXI.Sprite[];

    asteroidFolders;
    constructor(x: number, y: number, app: PIXI.Application, asteroid: Asteroid, numberOfSprite: number) {

        this.app = app;
        this.eventOk = 0;
        this.compteurEvent = 0;
        this.boolEvent = false;
        this.asteroid = new Array<PIXI.Sprite>();

        // Frenzy init
        this.frenzyModInit();

        // Asteroid init
        this.asteroidFolders =
            {
                'carbon': new Array<PIXI.Texture>(),
                'titanium': new Array<PIXI.Texture>(),
                'iron': new Array<PIXI.Texture>(),
                'hyperium': new Array<PIXI.Texture>(),
                'gold': new Array<PIXI.Texture>(),
            };
        this.checkAstero = false;
        //this.asteroidSeed = seed;
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

        let shakeAstex = 1;
        let shakeAstey = 1;
        // Listen for animate update
        this.app.ticker.add((delta) => {
            if (this.asteroid[0]) {
                if (this.delta > 2 * Math.PI) {
                    this.delta = 0;
                }
                this.delta += (2 * Math.PI) / 1000;

                if (this.checkAstero) {
                    this.deltaCompteur++;
                } else {
                    this.deltaCompteur = 0;
                }
                if (this.deltaCompteur > 20) {
                    shakeAstex = 150 * this.delta;
                    shakeAstey = 1 * this.delta;
                } else {
                    shakeAstex = this.delta;
                    shakeAstey = this.delta;
                }
                this.asteroid[0].x = this.xBaseAsteroid + Math.cos(shakeAstex) * -5;
                this.asteroid[0].y = this.yBaseAsteroid + Math.sin(shakeAstey) * -15;

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
        });
    }

    emitClickParticle(data) {
        this.clickEmitter.updateOwnerPos(data.global.x, data.global.y);
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
            this.app.stage.addChildAt(sprite, 1);
        } else {
            this.asteroid[0].addChild(sprite);
            sprite.x = x;
            sprite.y = y;

        }


        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('click', (event) => {
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
        });
    }

    initAsteroidSprites() {
        const keys = Object.keys(this.asteroidFolders);
        for (let id in keys) {
            const key = keys[id];
            this.asteroidFolders[key].push(PIXI.Texture.fromImage('assets/AsteroidSprites/' + key + '/b.png'));

            for (let spriteId = 1; spriteId <= 4; spriteId++) {
                this.asteroidFolders[key].push(PIXI.Texture.fromImage('assets/AsteroidSprites/' + key + '/' + spriteId + '.png'));
            }
        }
    }

    generateAsteroid(asteroid: Asteroid) {
        const state = asteroid.currentCapacity == asteroid.capacity ? 4 :
            Math.floor((asteroid.currentCapacity / asteroid.capacity) * 5);
        let seedNum = [];
        let nums = [1, 2, 3, 4];
        let comb = [[1, 1], [1, -1], [-1, -1], [-1, 1]];

        for (let i = 0; i < asteroid.seed.length; i++) {
            seedNum.push(parseInt(asteroid.seed[i]));
        }

        if (this.asteroid.length == 0) {
            this.asteroid.push(new PIXI.Sprite());
            this.asteroid.push(new PIXI.Sprite());
            this.asteroid.push(new PIXI.Sprite());
            this.asteroid.push(new PIXI.Sprite());
            this.asteroid.push(new PIXI.Sprite());
        }
        else {
            this.app.stage.removeChild(this.asteroid[0]);
            for (let i = 1; i < this.asteroid.length; i++) {
                this.asteroid[0].removeChild(this.asteroid[i]);
            }
        }


        this.asteroid[0].texture = this.asteroidFolders[asteroid.ore][0];

        for (let i = 0; i < state; i++) {
            this.asteroid[i + 1].texture = this.asteroidFolders[asteroid.ore][nums[seedNum[i]]];
        }

        if (asteroid.currentCapacity > 0) {
            this.addSpriteToScene(this.asteroid[0], 0, 0);
        }

        const offSet = 60;

        for (let i = 0; i < state; i++) {
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
    }
    // Change the sprite of asteroid when the user change 
    changeSprite(asteroid: Asteroid) {

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
                'start': 0.4,
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

    initAnimationBoomKrash() {
        this.boomAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['Boum'].texture, 236, 236));
        this.boomAnim.gotoAndPlay(0);
        this.boomAnim.anchor.set(0.5, 0.04);
        this.boomAnim.scale.set(1, 1);
        this.boomAnim.animationSpeed = 0.36;
        this.boomAnim.visible = false;
        this.boomAnim.loop = false;
        this.app.stage.addChildAt(this.boomAnim, 4);

        this.krashAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['krash'].texture, 236, 236));
        this.krashAnim.gotoAndPlay(0);
        this.krashAnim.anchor.set(0.5, 0.04);
        this.krashAnim.scale.set(1, 1);
        this.krashAnim.animationSpeed = 0.35;
        this.krashAnim.visible = false;
        this.krashAnim.loop = false;
        this.app.stage.addChildAt(this.krashAnim, 4);

        this.kaboomAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['kaboom'].texture, 236, 236));
        this.kaboomAnim.gotoAndPlay(0);
        this.kaboomAnim.anchor.set(0.5, 0.04);
        this.kaboomAnim.scale.set(1, 1);
        this.kaboomAnim.animationSpeed = 0.28;
        this.kaboomAnim.visible = false;
        this.kaboomAnim.loop = false;
        this.app.stage.addChildAt(this.kaboomAnim, 4);

        this.woomAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(PIXI.loader.resources['woom'].texture, 236, 236));
        this.woomAnim.gotoAndPlay(0);
        this.woomAnim.anchor.set(0.5, 0.04);
        this.woomAnim.scale.set(1, 1);
        this.woomAnim.animationSpeed = 0.28;
        this.woomAnim.visible = false;
        this.woomAnim.loop = false;
        this.app.stage.addChildAt(this.woomAnim, 4);
    }

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

    initAnimationFromSpriteName(spriteName, w, h, wSize, hSize, isLoop) {
        const tempAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, w, h));
        tempAnim.gotoAndPlay(0);
        tempAnim.animationSpeed = 0.25;
        tempAnim.alpha = 0.25;
        tempAnim.loop = isLoop;
        tempAnim.texture.baseTexture.mipmap = true;
        tempAnim.width = wSize;
        tempAnim.height = hSize;
        tempAnim.visible = false;
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

    initAnimationFromSpriteEvent(spriteName, w, h, isLoop) {
        const tempAnim = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
            PIXI.loader.resources[spriteName].texture, w, h));
        tempAnim.gotoAndPlay(0);
        tempAnim.animationSpeed = 0.35;
        tempAnim.loop = isLoop;
        tempAnim.texture.baseTexture.mipmap = true;
        tempAnim.visible = false;
        tempAnim.anchor.set(0.5);
        tempAnim.scale.set(0.25);
        tempAnim.rotation = 45;
        return tempAnim;
    }



    // Frenzy mod - - - - - - - - - - - - - - - -
    frenzyModTouch(numTouch: number) {
        if (this.asteroid && this.frenzyModAllTouchFinish() ) {
            const randomX = Math.floor(Math.random() * 100 ) - 100 ;
            const randomY = Math.floor(Math.random() * 100 ) - 100 ;

            this.arrowFrenzy[numTouch].position.set(this.xBaseAsteroid + randomX, this.yBaseAsteroid +randomY);
            this.arrowFrenzy[numTouch].visible = true;
        }

    }

    frenzyModTouchDown() {
        for (let i = 0 ; i < 4 ; i++) {
            this.arrowFrenzy[i].visible = false;
        }
    }

    frenzyModAllTouchFinish() {
        for (let i = 0 ; i < 4 ; i++) {
            if (this.arrowFrenzy[i].visible) {
                return false;
            }
        }
        return true;
    }

    frenzyModInit() {
        this.arrowFrenzy = new Array<PIXI.Sprite>();
        for (let i = 0 ; i < 4 ; i++) {
            this.arrowFrenzy.push(PIXI.Sprite.fromImage('assets/frenzy/arrow'+ i + '.png'));
            this.arrowFrenzy[i].visible = false;
            this.arrowFrenzy[i].scale.set(0.25,0.25);
            this.app.stage.addChild(this.arrowFrenzy[i]);
        }
    }

}
