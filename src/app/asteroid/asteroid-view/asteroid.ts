import * as PIXI from 'pixi.js';
import * as TWEEN from 'tween.js';

export class Asteroid {
    asteroid: PIXI.Sprite;
    app: PIXI.Application;

    constructor(x: number , y: number, app: PIXI.Application) {
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
        this.asteroid.on('click', (event) => {
            console.log('hit !');
        });
        const position = { x: 100, y: 0 };

                // Create a tween for position first
        const tween = new TWEEN.Tween(position);

        // Then tell the tween we want to animate the x property over 1000 milliseconds
        tween.to({ x: 200 }, 1000);
        tween.start();
        console.log(tween);
    }
}
