import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Ship } from './ship';
import { UserService } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { UpgradeType } from '../upgrade-class/upgrade';
import { getFramesFromSpriteSheet } from '../../loadAnimation';

@Component({
  selector: 'app-ship-view',
  templateUrl: './ship-view.component.html',
  styleUrls: ['./ship-view.component.scss']
})

export class ShipViewComponent implements AfterViewInit {
  private app: PIXI.Application;
  private v: number;
  private ship: Ship;
  private boolShipTourelle: boolean;


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

      this.boolShipTourelle = false;

      const background = PIXI.Sprite.fromImage('assets/Ciel.jpg');
      background.width = this.app.renderer.width;
      background.height = this.app.renderer.height;
      this.app.stage.addChild(background);
      // skyV1
      // this.initSky('skyV1', 500, 500);
      
      this.ship = new Ship(this.app);
      // init
      //this.ship.autoUpgrade(this.userS.currentUser.upgradesLvl[UpgradeType.storage], this.ship.reacteur);
      this.ship.autoUpgrade(this.userS.currentUser.upgradesLvl[UpgradeType.storage], this.ship.stockUpgrade);
      // this.ship.autoUpgrade(this.userS.currentUser.mineRateLvl, this.ship.radarUpgrade);
      this.ship.autoUpgrade(this.userS.currentUser.upgradesLvl[UpgradeType.mineRate], this.ship.droneUpgrade);
      this.ship.autoUpgrade(this.userS.currentUser.upgradesLvl[UpgradeType.mineRate] + 2, this.ship.smokeRadarUpgrade);
      if (this.userS.currentUser.upgradesLvl[UpgradeType.storage] > 0 && !this.boolShipTourelle) {
        this.ship.iNewTourelle = 4;
        this.ship.initNewTourelle('newTourelle_4', 500, 500);
        this.boolShipTourelle = true;
      }

      this.userS.upgradeSubject.subscribe( (user: User) => {
          // this.ship.autoUpgrade(user.upgradesLvl[UpgradeType.storage], this.ship.reacteur);
          this.ship.autoUpgrade(this.userS.currentUser.upgradesLvl[UpgradeType.storage], this.ship.stockUpgrade);
          // this.ship.autoUpgrade(user.mineRateLvl, this.ship.radarUpgrade);
          this.ship.autoUpgrade(this.userS.currentUser.upgradesLvl[UpgradeType.mineRate], this.ship.droneUpgrade);
          this.ship.autoUpgrade(user.upgradesLvl[UpgradeType.mineRate] + 2, this.ship.smokeRadarUpgrade);

          if (this.userS.currentUser.upgradesLvl[UpgradeType.storage] > 0 && !this.boolShipTourelle) {
            this.ship.iNewTourelle = 4;
            this.ship.initNewTourelle('newTourelle_4', 500, 500);
            this.boolShipTourelle = true; 
          }
      });
    }

    // initial ship animated Sprite
    initSky(spriteName: string, width: number, height: number) {
      const backgroundSky = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
          PIXI.loader.resources[spriteName].texture, width, height));
      backgroundSky.gotoAndPlay(0);
      backgroundSky.animationSpeed = 0.35;
      backgroundSky.visible = true;
      backgroundSky.texture.baseTexture.mipmap = true;
      backgroundSky.anchor.set(0.5);

      backgroundSky.x = this.app.renderer.width;
      backgroundSky.y = this.app.renderer.height;

      this.app.stage.addChild(backgroundSky);
  }

}
