import * as PIXI from 'pixi.js';
import * as TWEEN from 'tween.js';
import { UserService } from '../../user/user.service';
import * as PIXIParticles from 'pixi-particles';
import { ParticleBase } from '../../pixiVisual/particleBase';

export class AsteroidSprite {
    asteroid: PIXI.Sprite[];
    app: PIXI.Application;
    emitter: ParticleBase;
    asteroidOre: string;
    delta = 0;

    xBaseAsteroid: number;
    yBaseAsteroid: number;

    spriteAsteroidCarbon: PIXI.Texture[];
    asteroidFolders;
    constructor(x: number, y: number, app: PIXI.Application, asteroidOre: string, numberOfSprite: number) {

        this.app = app;
        this.asteroid = new Array<PIXI.Sprite>();
        this.asteroidFolders = { "carbon": new Array<PIXI.Texture>(), "titanium": new Array<PIXI.Texture>() };

        this.asteroidOre = asteroidOre;
        this.initAsteroidSprites();
        this.generateAsteroid(asteroidOre);

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
            this.app.stage.addChild(sprite);
        } else {
            sprite.x = (this.asteroid[0].width / 2) + x;
            sprite.y = (this.asteroid[0].height / 2) + y;
            this.asteroid[0].addChild(sprite);
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

        this.asteroid.push(new PIXI.Sprite());
        this.asteroid.push(new PIXI.Sprite());
        this.asteroid.push(new PIXI.Sprite());
        this.asteroid.push(new PIXI.Sprite());
        this.asteroid.push(new PIXI.Sprite());


        this.addSpriteToScene(this.asteroid[0], 0, 0);

        const offSet = 60;
        this.addSpriteToScene(this.asteroid[1], -offSet, -offSet);
        this.addSpriteToScene(this.asteroid[2], -offSet, offSet);
        this.addSpriteToScene(this.asteroid[3], offSet, offSet);
        this.addSpriteToScene(this.asteroid[4], offSet, -offSet);

    }

    generateAsteroid(asteroidType: string) {
        let nums = [1, 2, 3, 4];
        let ranPos = [];
        let i = nums.length;
        let j = 0;

        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            ranPos.push(nums[j]);
            nums.splice(j, 1);
        }

        nums = [0, 1, 2, 3];
        let ranDepth = [];
        i = nums.length;
        j = 0;

        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            ranDepth.push(nums[j]);
            nums.splice(j, 1);
        }

        this.asteroid[0].texture = this.asteroidFolders[asteroidType][0];

        this.asteroid[1].texture = this.asteroidFolders[asteroidType][ranPos[0]];
        this.asteroid[2].texture = this.asteroidFolders[asteroidType][ranPos[1]];
        this.asteroid[3].texture = this.asteroidFolders[asteroidType][ranPos[2]];
        this.asteroid[4].texture = this.asteroidFolders[asteroidType][ranPos[3]];

    }
    // Change the sprite of asteroid when the user change 
    changeSprite(asteroidOre: string) {
        if (this.asteroidOre !== asteroidOre) {
            this.asteroidOre = asteroidOre;
            this.generateAsteroid(asteroidOre);
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
