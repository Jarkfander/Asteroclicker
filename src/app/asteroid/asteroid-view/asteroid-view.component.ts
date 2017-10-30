import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-asteroid-view',
  templateUrl: './asteroid-view.component.html',
  styleUrls: ['./asteroid-view.component.scss']
})
export class AsteroidViewComponent implements AfterViewInit {
  constructor(private el: ElementRef, private render: Renderer2) {}
  private app: PIXI.Application;

    ngAfterViewInit() {
      this.app = new PIXI.Application(400, 300, {backgroundColor : 0x1099bb});
      this.render.appendChild(this.el.nativeElement, this.app.view);
    }
}
