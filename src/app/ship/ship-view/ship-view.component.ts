import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Ship } from './ship';
import { UserService } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { UpgradeType } from '../upgrade-class/upgrade';
import { getFramesFromSpriteSheet } from '../../loadAnimation';
import { SocketService } from '../../shared/socket/socket.service';

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
  private backgroundSky: PIXI.extras.AnimatedSprite;
  private numberOfSky: number;

  constructor(private el: ElementRef, private render: Renderer2, private userS: UserService, private socketS: SocketService) {}
  
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
    this.app = new PIXI.Application(w, h, { backgroundColor: 0xffffff });
    this.render.appendChild(this.el.nativeElement, this.app.view);

    this.boolShipTourelle = false;

    // skyV1
    this.numberOfSky = 1;
    this.initSky('skyV0_1', 500, 500, w, h);

    this.ship = new Ship(this.app);
    // init
    this.ship.autoUpgrade(this.userS.currentUser.upgrades[UpgradeType.storage].lvl, this.ship.stockUpgrade);
    // this.ship.autoUpgrade(this.userS.currentUser.mineRateLvl, this.ship.radarUpgrade);
    this.ship.autoUpgrade(this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl, this.ship.droneUpgrade);
    this.ship.autoUpgrade(this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl + 2, this.ship.smokeRadarUpgrade);

    this.userS.upgradeSubject.subscribe((user: User) => {
      this.ship.autoUpgrade(user.upgrades[UpgradeType.storage].lvl, this.ship.stockUpgrade);

      // this.ship.autoUpgrade(user.upgradesLvl[UpgradeType.storage], this.ship.reacteur);
      this.ship = new Ship(this.app);
      this.ship.numberOfChest = this.userS.currentUser.numberOfChest;
      this.ship.initChest();

      // this.ship.autoUpgrade(user.mineRateLvl, this.ship.radarUpgrade);
      this.ship.autoUpgrade(this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl, this.ship.droneUpgrade);
      this.ship.autoUpgrade(user.upgrades[UpgradeType.mineRate].lvl + 2, this.ship.smokeRadarUpgrade);

      if (this.userS.currentUser.upgrades[UpgradeType.storage].lvl > 0 && !this.boolShipTourelle) {
        this.ship.iNewTourelle = 4;
        this.ship.initNewTourelle('newTourelle_4', 500, 500);
        this.boolShipTourelle = true;
      }

    });

  }

  // initial ship animated Sprite
  initSky(spriteName: string, width: number, height: number, w, h) {
    this.backgroundSky = new PIXI.extras.AnimatedSprite(getFramesFromSpriteSheet(
      PIXI.loader.resources[spriteName].texture, width, height));
    this.backgroundSky.gotoAndPlay(0);
    this.backgroundSky.animationSpeed = 0.32;
    this.backgroundSky.visible = true;
    this.backgroundSky.loop = false;

    this.backgroundSky.texture.baseTexture.mipmap = true;
    this.backgroundSky.anchor.set(0.5);

    this.backgroundSky.x = w / 2;
    this.backgroundSky.y = h / 2;

    this.backgroundSky.width = w;
    this.backgroundSky.height = h;

    this.app.stage.addChild(this.backgroundSky);

    this.backgroundSky.onComplete = () => {
      this.skyAfterAnimation();
    };
  }

  skyAfterAnimation() {
    this.numberOfSky = ((this.numberOfSky + 1) % 7) === 0 ? 1 : ((this.numberOfSky + 1) % 7);
    const stringSky: string = 'skyV0_' + this.numberOfSky;

    const tempBackground = getFramesFromSpriteSheet(PIXI.loader.resources[stringSky].texture, 500, 500);

    for (let i = 0; i < this.backgroundSky.textures.length; i++) {
      this.backgroundSky.textures[i] = tempBackground[i];
    }
    this.backgroundSky.gotoAndPlay(0);
  }

  clickChest() {
    for (let i = 0; i < this.ship.numberOfChest; i++) {
      let sprite = new PIXI.Sprite;
      sprite = this.ship.spriteChestTab[i];
      sprite.interactive = true;
      sprite.buttonMode = true;
      sprite.on('click', (event) => {
          console.log('open chest' + i);

          // FAIRE OUVERTURE COFFRE i ICI et faire en sorte que quand c'est fini oncomplete ça fait le socket.removeChest 
          this.socketS.removeChest();
      });
    }
  }




}
