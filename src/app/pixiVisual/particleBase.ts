import * as PIXIParticles from "pixi-particles";
import * as PIXI from 'pixi.js';
export class ParticleBase extends PIXIParticles.Emitter {

    constructor(appStage, img, config) {
        var emitterContainer: PIXI.Container = new PIXI.Container();
        appStage.addChild(emitterContainer);
        super(emitterContainer, img, config);

        // Calculate the current time
        var elapsed = Date.now();

        // Update function every frame
        var particleUpdate = ()=> {
            // Update the next frame
            requestAnimationFrame(particleUpdate);

            var now = Date.now();

            // The emitter requires the elapsed
            // number of seconds since the last update
            this.update((now - elapsed) * 0.001);
            elapsed = now;

        };
        this.emit = true;
        particleUpdate();
    }


}
