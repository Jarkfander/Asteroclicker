import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Ship } from './ship';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';

@Component({
  selector: 'app-ship-view',
  templateUrl: './ship-view.component.html',
  styleUrls: ['./ship-view.component.scss']
})

export class ShipViewComponent implements AfterViewInit {
  private app: PIXI.Application;
  private v: number;
  private ship: Ship;

  constructor(private el: ElementRef, private render: Renderer2, private userS: UserService) {}

    ngAfterViewInit() {
      const w = this.el.nativeElement.parentElement.offsetWidth;
      const h = this.el.nativeElement.parentElement.offsetHeight;

      this.app = new PIXI.Application(w, h, {backgroundColor : 0x1099bb});
      this.render.appendChild(this.el.nativeElement, this.app.view);

      const background = PIXI.Sprite.fromImage('assets/Ciel.jpg');
      background.width = this.app.renderer.width;
      background.height = this.app.renderer.height;
      this.app.stage.addChild(background);

      this.ship = new Ship(0.25, 0.25, this.app);
      // init
      this.ship.autoUpgrade(this.userS.currentUser.storageLvl, this.ship.stockUpgrade);
      this.ship.autoUpgrade(this.userS.currentUser.mineRateLvl, this.ship.radarUpgrade);

      this.userS.userSubject.subscribe( (user: User) => {
          this.ship.autoUpgrade(user.storageLvl, this.ship.stockUpgrade);
          this.ship.autoUpgrade(user.mineRateLvl, this.ship.radarUpgrade);
      });

    }

    @HostListener('window:resize') onResize() {
      const w = this.el.nativeElement.parentElement.offsetWidth;
      const h = this.el.nativeElement.parentElement.offsetHeight;
      this.app.renderer.resize(w, h);
    }

}
