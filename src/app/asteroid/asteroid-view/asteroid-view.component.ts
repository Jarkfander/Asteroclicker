import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Asteroid } from './asteroid';
import { Drone } from './drone';

@Component({
  selector: 'app-asteroid-view',
  templateUrl: './asteroid-view.component.html',
  styleUrls: ['./asteroid-view.component.scss']
})

export class AsteroidViewComponent implements AfterViewInit {
  private app: PIXI.Application;
  private aster: Asteroid;
  private drone: Drone;

  constructor(private el: ElementRef, private render: Renderer2) {}

    ngAfterViewInit() {
      const w = this.el.nativeElement.offsetWidth;
      const h = this.el.nativeElement.offsetHeight;

      this.app = new PIXI.Application(w, h, {backgroundColor : 0x1079bb});
      this.render.appendChild(this.el.nativeElement, this.app.view);

      const background = PIXI.Sprite.fromImage('assets/Ciel.jpg');
      background.width = this.app.renderer.width;
      background.height = this.app.renderer.height;
      this.app.stage.addChild(background);

      this.aster = new Asteroid(0.25, 0.25, this.app);
      this.drone = new Drone(0.25, 0.25, this.app);
    }
}
