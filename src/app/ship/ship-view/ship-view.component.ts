import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Ship } from './ship';
import { UserService, IUpgrades, IProfile } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { UpgradeType } from '../upgrade-class/upgrade';
import { getFramesFromSpriteSheet, initSprite, changeSpriteInAnime } from '../../loadAnimation';
import { SocketService } from '../../shared/socket/socket.service';
import { ChestSprite } from './chestSprite';

@Component({
  selector: 'app-ship-view',
  templateUrl: './ship-view.component.html',
  styleUrls: ['./ship-view.component.scss']
})

export class ShipViewComponent implements AfterViewInit {
  private app: PIXI.Application;
  private v: number;
  private ship: Ship;
  private chestSprite: ChestSprite;
  private boolShipTourelle: boolean;
  private backgroundSky: PIXI.extras.AnimatedSprite;
  private numberOfSky: number;

  private animationLoaded = false;

  constructor(private el: ElementRef, private render: Renderer2, private userS: UserService, private socketS: SocketService) { }

  ngAfterViewInit() {
    setTimeout(() => this.initPixi(), 0);
  }

  @HostListener('window:resize') onResize() {
    this.app.stage.removeChildren();
    this.render.removeChild(this.el.nativeElement, this.app.view);
    delete this.ship;
    this.app.destroy();
    this.initPixi();
  }


  private initPixi() {
    const w = this.el.nativeElement.offsetWidth;
    const h = this.el.nativeElement.offsetHeight;
    this.app = new PIXI.Application(w, h, { backgroundColor: 0xffffff });
    this.render.appendChild(this.el.nativeElement, this.app.view);

    this.boolShipTourelle = false;

    // skyV1
    this.numberOfSky = 1;
    this.initSky(w, h);

    this.chestSprite = new ChestSprite(this.app, this.userS.currentUser.numberOfChest);
    this.ship = new Ship(this.app, this.chestSprite);
    this.chestSprite.afterInitShip();
    this.ship.ship.addChildAt(this.chestSprite.spriteChestParent, 5);

    this.clickChest();
    // init

    // start the animation before the init
    if (this.ship.ship.cacheAsBitmap) {
      setInterval(() => {
        this.ship.ship.cacheAsBitmap = false;
      }, 10000);
    }

    this.userS.profile.subscribe((profile: IProfile) => {
      this.animationGoodConfig(profile.badConfig === 1);
    });

    this.userS.upgrade.subscribe((upgrades: IUpgrades) => {

      if (this.animationLoaded) {
        this.ship.autoUpgrade(upgrades.storage.lvl, this.ship.stockUpgrade);
        this.ship.autoUpgrade(upgrades.research.lvl, this.ship.radarUpgrade);
        this.ship.autoUpgrade(upgrades.mineRate.lvl, this.ship.droneUpgrade);
        this.ship.autoUpgrade(upgrades.engine.lvl, this.ship.reacteurUpgrade);
        this.ship.ship.cacheAsBitmap = false;
      }

      if (upgrades.storage.lvl >= 2 && !this.boolShipTourelle) {
        this.ship.initNewTourelle();
        this.boolShipTourelle = true;
      }

    });

    this.userS.upgrade.take(1).subscribe((upgrades: IUpgrades) => {
      this.initWithTimeUpgrade(upgrades);
    });

    this.userS.chestSubject.subscribe((user: User) => {
      this.chestSprite.numberOfChest = user.numberOfChest;
      this.chestSprite.supChest();
      this.clickChest();
    });
  }


  initWithTimeUpgrade(upgrades: IUpgrades) {
    let i = 0;
    const tabTempUpgrade = new Array<any>();
    const tabTempUpgradeLvl = new Array<any>();

    tabTempUpgrade.push(this.ship.stockUpgrade);
    tabTempUpgradeLvl.push(upgrades.storage.lvl);
    tabTempUpgrade.push(this.ship.radarUpgrade);
    tabTempUpgradeLvl.push(upgrades.research.lvl);
    tabTempUpgrade.push(this.ship.droneUpgrade);
    tabTempUpgradeLvl.push(upgrades.mineRate.lvl);
    tabTempUpgrade.push(this.ship.reacteurUpgrade);
    tabTempUpgradeLvl.push(upgrades.engine.lvl);

    setInterval(() => {
      if (i < 4) {
        this.ship.autoUpgrade(tabTempUpgradeLvl[i], tabTempUpgrade[i]);
        i++;
      } else if (!this.animationLoaded) {
        this.animationLoaded = true;
      }
    }, 2500);
  }

  // initial ship animated Sprite
  initSky(w, h) {
    this.backgroundSky = initSprite('skyV0_1', 500, 500, true,
      this.userS.currentUser.boolBadConfig, 0.32);
    this.backgroundSky.loop = false;
    this.backgroundSky.texture.baseTexture.mipmap = true;

    this.backgroundSky.x = w / 2;
    this.backgroundSky.y = h / 2;

    this.backgroundSky.width = w;
    this.backgroundSky.height = h;

    this.app.stage.addChild(this.backgroundSky);

    this.backgroundSky.onComplete = () => {
      this.numberOfSky = changeSpriteInAnime(this.backgroundSky, 'skyV0_', this.numberOfSky, 7);
      this.backgroundSky.gotoAndPlay(0);
    };
  }

  // Animation when you click on chest
  clickChest() {
    if (this.chestSprite.numberOfChest > 0) {
      const tempSprite: any = this.chestSprite.spriteChestParent.children;
      tempSprite[0].interactive = true;
      tempSprite[0].buttonMode = true;
      tempSprite[0].on('click', (event) => {
        tempSprite[0].visible = false;
        tempSprite[0].buttonMode = false;
        tempSprite[0].interactive = false;

        tempSprite[1].visible = true;
        tempSprite[3].visible = true;
        tempSprite[1].gotoAndPlay(0);
        tempSprite[3].gotoAndPlay(0);
        tempSprite[1].onComplete = () => {
          tempSprite[3].addChild(this.chestSprite.spriteTextChest);
          const xTemp = -50;
          const yTemp = -10;

          let tempChest = this.userS.currentUser.chest[this.chestSprite.numberOfChest - 1].chest1;
          this.chestSprite.openChestText(0, xTemp - 42, yTemp + 12,
            Object.keys(tempChest)[0], tempChest[Object.keys(tempChest)[0]]);

          tempChest = this.userS.currentUser.chest[this.chestSprite.numberOfChest - 1].chest2;
          this.chestSprite.openChestText(0, xTemp + 27, yTemp - 25, Object.keys(tempChest)[0], tempChest[Object.keys(tempChest)[0]]);

          tempChest = this.userS.currentUser.chest[this.chestSprite.numberOfChest - 1].chest3;
          this.chestSprite.openChestText(0, xTemp + 90, yTemp + 20, Object.keys(tempChest)[0], tempChest[Object.keys(tempChest)[0]]);

          tempSprite[1].interactive = true;
          tempSprite[1].buttonMode = true;
          tempSprite[1].on('click', () => {
            this.chestSprite.spriteTextChest.destroy();
            tempSprite[3].visible = false;
            tempSprite[1].interactive = false;
            tempSprite[1].buttonMode = false;
            tempSprite[4].visible = true;
            tempSprite[4].gotoAndPlay(0);

            tempSprite[4].onComplete = () => {

              tempSprite[4].visible = false;
              tempSprite[1].visible = false;

              tempSprite[5].visible = true;
              tempSprite[5].gotoAndPlay(0);
              tempSprite[2].visible = true;
              tempSprite[2].gotoAndPlay(0);

              delete this.chestSprite.spriteTextChest;

              tempSprite[2].onComplete = () => {
              };

              tempSprite[5].onComplete = () => {
                this.socketS.removeChest(this.userS.currentUser.uid, this.userS.currentUser.numberOfChest);
              };
            };
          });

        };
      });
    }
  }

  animationGoodConfig(isBadConfig: boolean) {
    this.ship.radarUpgrade.allAnimBeginOrStop(isBadConfig);
    this.ship.reacteurUpgrade.allAnimBeginOrStop(isBadConfig);
    this.ship.stockUpgrade.allAnimBeginOrStop(isBadConfig);
    this.ship.droneUpgrade.allAnimBeginOrStop(isBadConfig);
    if (isBadConfig) {
      this.backgroundSky.stop();
      this.ship.tourelle.stop();
    } else {
      this.backgroundSky.play();
      this.ship.tourelle.play();
    }
  }

}
