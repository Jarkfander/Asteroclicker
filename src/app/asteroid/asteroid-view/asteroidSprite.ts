import * as PIXI from 'pixi.js';
import * as TWEEN from 'tween.js';
import { UserService } from '../../user/user.service';
import * as PIXIParticles from 'pixi-particles';
import { ParticleBase } from '../../pixiVisual/particleBase';
import { Asteroid } from '../asteroid';

export class AsteroidSprite {
    asteroid: PIXI.Sprite[];
    app: PIXI.Application;
    emitter: ParticleBase;
    asteroidSeed: string;
    delta = 0;

    xBaseAsteroid: number;
    yBaseAsteroid: number;

    spriteAsteroidCarbon: PIXI.Texture[];
    asteroidFolders;
    constructor(x: number, y: number, app: PIXI.Application, asteroid:Asteroid, numberOfSprite: number) {

        this.app = app;
        this.asteroid = new Array<PIXI.Sprite>();
        this.asteroidFolders = { "carbon": new Array<PIXI.Texture>(), "titanium": new Array<PIXI.Texture>() };

        //this.asteroidSeed = seed;
        this.initAsteroidSprites();
        this.generateAsteroid(asteroid);

        this.InitializeEmitter();

        this.xBaseAsteroid = this.asteroid[0].x;
        this.yBaseAsteroid = this.asteroid[0].y;

        // Listen for animate update
        this.app.ticker.add((delta) => {
            if (this.asteroid[0]) {
                if (this.delta > 2 * Math.PI) {
                    this.delta = 0; 
                }
                this.delta += (2 * Math.PI) / 1000;

                this.asteroid[0].x = this.xBaseAsteroid + Math.cos(this.delta) * -5;
                this.asteroid[0].y = this.yBaseAsteroid + Math.sin(this.delta) * -15;
            }
        });

    }

    emitParticle(data) {
        this.emitter.emit = true;
        this.emitter.updateOwnerPos(data.global.x, data.global.y);
    }

    addSpriteToScene(sprite: PIXI.Sprite, x: number, y: number) {

        sprite.texture.baseTexture.mipmap = true;
        sprite.anchor.set(0.5);

        if (x === 0 && y === 0) {
            sprite.x = (this.app.renderer.width / 2) + x;
            sprite.y = (this.app.renderer.height / 2) + y;
            this.app.stage.addChildAt(sprite,1);
        } else {
            this.asteroid[0].addChild(sprite);
            sprite.x = x;
            sprite.y = y;

        }


        sprite.interactive = true;
        sprite.buttonMode = true;

        sprite.on('click', (event) => {
            this.emitParticle(event.data);
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

    generateAsteroid(asteroid : Asteroid) {
        const state=asteroid.currentCapacity==asteroid.capacity?4:
        Math.floor((asteroid.currentCapacity/asteroid.capacity)*5);
        let seedNum=[];
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

        for(let i=0;i<state;i++){
            this.asteroid[i+1].texture = this.asteroidFolders[asteroid.ore][nums[seedNum[i]]];
        }


        this.addSpriteToScene(this.asteroid[0], 0, 0);
        const offSet = 60;

        for(let i=0;i<state;i++){
            this.addSpriteToScene(this.asteroid[i+1], comb[seedNum[i+4]][0] * offSet, comb[seedNum[i+4]][1] * offSet);
        }
    }
    // Change the sprite of asteroid when the user change 
    changeSprite(asteroid:Asteroid) {
        if (asteroid.seed !== this.asteroidSeed) {
            this.asteroidSeed = asteroid.seed;
            this.generateAsteroid(asteroid);
        }
    }

    InitializeEmitter() {
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
                'min': 0,
                'max': 0
            },
            'lifetime': {
                'min': 0.5,
                'max': 0.5
            },
            'frequency': 0.008,
            'emitterLifetime': 0.20,
            'maxParticles': 1000,
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

        this.emitter = new ParticleBase(
            this.app.stage,
            PIXI.Texture.fromImage('assets/smallRock.png'),
            config
        );
    }
}
