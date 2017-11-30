import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Ship } from './ship';
import { UserService } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';

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
      this.initPixi();
    }

    @HostListener('window:resize') onResize() {
      this.app.stage.removeChildren();
      this.render.removeChild(this.el.nativeElement, this.app.view);
      delete this.ship;
      this.app.destroy();

      this.initPixi();
    }


    initPixi() {
      const w = this.el.nativeElement.parentElement.offsetWidth;
      const h = this.el.nativeElement.parentElement.offsetHeight;
      this.app = new PIXI.Application(w, h, {backgroundColor : 0xffffff});
      this.render.appendChild(this.el.nativeElement, this.app.view);

      const background = PIXI.Sprite.fromImage('assets/Ciel.jpg');
      background.width = this.app.renderer.width;
      background.height = this.app.renderer.height;
      this.app.stage.addChild(background);

      this.ship = new Ship(this.app);
      // init
      this.ship.autoUpgrade(this.userS.currentUser.storageLvl, this.ship.stockUpgrade);
      // this.ship.autoUpgrade(this.userS.currentUser.mineRateLvl, this.ship.radarUpgrade);
      this.ship.autoUpgrade(this.userS.currentUser.mineRateLvl, this.ship.droneUpgrade);
      this.ship.autoUpgrade(this.userS.currentUser.mineRateLvl + 2, this.ship.smokeRadarUpgrade);

      this.userS.upgradeSubject.subscribe( (user: User) => {
          this.ship.autoUpgrade(user.storageLvl, this.ship.stockUpgrade);
          // this.ship.autoUpgrade(user.mineRateLvl, this.ship.radarUpgrade);
          this.ship.autoUpgrade(this.userS.currentUser.mineRateLvl, this.ship.droneUpgrade);
          this.ship.autoUpgrade(user.mineRateLvl + 2, this.ship.smokeRadarUpgrade);
      });
    }
}
