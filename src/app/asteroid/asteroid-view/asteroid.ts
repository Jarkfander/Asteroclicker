import * as PIXI from 'pixi.js';
import * as TWEEN from 'tween.js';
import { UserService } from '../../user/user.service';
import * as PIXIParticles from "pixi-particles";

export class Asteroid {
    asteroid: PIXI.Sprite;
    app: PIXI.Application;

    constructor(x: number, y: number, app: PIXI.Application) {
        this.app = app;

        this.asteroid = PIXI.Sprite.fromImage('assets/Asteroïde.png');
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

        this.asteroid.on('click', (event) => {
            emitter.emit = true;
            emitter.updateOwnerPos(event.data.global.x,event.data.global.y);

        });

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
                    "min": 0,
                    "max": 360
                },
                "rotationSpeed": {
                    "min": 0,
                    "max": 0
                },
                "lifetime": {
                    "min": 0.5,
                    "max": 0.5
                },
                "frequency": 0.008,
                "emitterLifetime": 0.20,
                "maxParticles": 1000,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "circle",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 0
                }
            };

        /*var preMultAlpha = !!options.preMultAlpha;
        if(rendererOptions.transparent && !preMultAlpha)
            rendererOptions.transparent = "notMultiplied";*/
        var stage = app.stage;

        var emitterContainer: PIXI.Container = new PIXI.Container();
        stage.addChild(emitterContainer);
        var emitter: PIXIParticles.Emitter = new PIXIParticles.Emitter(
            emitterContainer,
           PIXI.Texture.fromImage('assets/smallRock.png'),
            config
        );

        // Calculate the current time
        var elapsed = Date.now();

        // Update function every frame
        var update = function () {
            // Update the next frame
            requestAnimationFrame(update);

            var now = Date.now();

            // The emitter requires the elapsed
            // number of seconds since the last update
            emitter.update((now - elapsed) * 0.001);
            elapsed = now;

            // Should re-render the PIXI Stage
            // renderer.render(stage);
        };
        emitter.emit = true;
        update();
        // Then tell the tween we want to animate the x property over 1000 milliseconds
        tween.to({ x: 200 }, 1000).onUpdate(function onUpdate() {
            this.asteroid.x += 10;
        }).start(now);

    }
}
