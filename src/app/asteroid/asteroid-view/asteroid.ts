import * as PIXI from 'pixi.js';
import * as TWEEN from 'tween.js';
import { UserService } from '../../user/user.service';
import * as PIXIParticles from "pixi-particles";
import { ParticleBase } from '../../pixiVisual/particleBase';

export class Asteroid {
    asteroid: PIXI.Sprite;
    app: PIXI.Application;
    emitter: ParticleBase;
    numAsteroid: number;

    constructor(x: number, y: number, app: PIXI.Application, numAsteroid: number) {
        this.app = app;
        this.numAsteroid = numAsteroid;

        this.asteroid = PIXI.Sprite.fromImage('assets/Asteroid/Asteroïde_' + this.numAsteroid + '.png');
        this.asteroid.texture.baseTexture.mipmap = true;
        this.asteroid.anchor.set(0.5);
        this.asteroid.scale.set(x, y);

        this.asteroid.x = this.app.renderer.width / 2 + 100;
        this.asteroid.y = this.app.renderer.height / 2 + 100;
        this.app.stage.addChild(this.asteroid);

        this.asteroid.interactive = true;
        this.asteroid.buttonMode = true;

        const position = { x: 100, y: 0 };
        const now = 0;
        // Create a tween for position first
        const tween = new TWEEN.Tween(position);

        this.InitializeEmitter();

        this.asteroid.on('click', (event) => {
            this.emitter.emit = true;
            this.emitter.updateOwnerPos(event.data.global.x, event.data.global.y);

        });

        // Then tell the tween we want to animate the x property over 1000 milliseconds
        tween.to({ x: 200 }, 1000).onUpdate(function onUpdate() {
            this.asteroid.x += 10;
        }).start(now);

    }

    InitializeEmitter() {
        const config =
            {
                "alpha": {
                    "start": 1,
                    "end": 1
                },
                "scale": {
                    "start": 1,
                    "end": 0
                },
                "color": {
                    "start": "ffffff",
                    "end": "ffffff"
                },
                "speed": {
                    "start": 300,
                    "end": 100
                },
                "startRotation": {
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

    changeSprite(num: number) {
        this.numAsteroid = num;
        this.asteroid = PIXI.Sprite.fromImage('assets/Asteroid/Asteroïde_' + this.numAsteroid + '.png');
    }
}
