import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Ship } from './ship';
import { UserService, IProfile, IUserUpgrade, IChest } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { UpgradeType } from '../upgrade-class/upgrade';
import { getFramesFromSpriteSheet, initSprite, changeSpriteInAnime } from '../../loadAnimation';
import { SocketService } from '../../shared/socket/socket.service';
import { ChestSprite } from './chestSprite';
import { UpgradeService } from '../upgrade.service';
import { Observable } from 'rxjs/Observable';
import { fail } from 'assert';


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

  private animationLoaded = false;
  public activeUpgrade$: Observable<IUserUpgrade>;

  constructor(private el: ElementRef,
    private render: Renderer2,
    private userS: UserService,
    private upgradeS: UpgradeService,
    private socketS: SocketService) { }

  ngAfterViewInit() {
    this.activeUpgrade$ = this.upgradeS.activeUserUpgrade$.asObservable();

    this.initPixi();

    this.userS.profile.subscribe((profile: IProfile) => {
      this.animationGoodConfig(profile.badConfig === 1);
    });

    this.userS.upgrade.subscribe((upgrades: IUserUpgrade[]) => {

      if (this.animationLoaded) {

        for (let i = 0; i < upgrades.length; i++) {
          if (upgrades[i].name !== 'QG') {
            this.ship.autoUpgrade(upgrades[i].lvl, this.ship[upgrades[i].name]);
          }

          if (upgrades[i].name === 'storage') {
            if (upgrades[i].lvl >= 2 && !this.boolShipTourelle) {
              this.ship.initNewTourelle();
              this.boolShipTourelle = true;
            }
          }
        }
        this.ship.ship.cacheAsBitmap = false;
      }
    });

    this.userS.upgrade.take(1).subscribe((upgrades: IUserUpgrade[]) => {
      this.initWithTimeUpgrade(upgrades);
    });

    this.userS.chest.subscribe((chests: IChest[]) => {
      this.ship.chest.numberOfChest = chests.length;
      this.ship.chest.supChest();
      this.clickChest(chests);
    });


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

    this.ship = new Ship(this.app);
    this.ship.chest.afterInitShip();
    this.ship.ship.addChildAt(this.ship.chest.spriteChestParent, 5);
    this.ship.stepTutorial.subscribe((iBool: boolean) => {
      if (iBool) {
        this.socketS.nextStep();
      }
    });
    // init musique
    /*
    PIXI.loader.load(function (loader, resources) {
      resources.enrico.data.play();
    });
    */

    // start the animation before the init
    if (this.ship.ship.cacheAsBitmap) {
      setInterval(() => {
        this.ship.ship.cacheAsBitmap = false;
      }, 10000);
    }
  }


  initWithTimeUpgrade(upgrades: IUserUpgrade[]) {
    let i = 0;
    const tabTempUpgrade = new Array<any>();
    const tabTempUpgradeLvl = new Array<any>();

    for (let j = 0; j < upgrades.length; j++) {
      if (upgrades[j].name !== 'QG') {
        tabTempUpgrade.push(this.ship[upgrades[j].name]);
        tabTempUpgradeLvl.push(upgrades[j].lvl);
      }
    }

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
    this.backgroundSky = initSprite('ciel2_1', 500, 500, true,
      false, 0.32);
    this.backgroundSky.loop = false;
    this.backgroundSky.texture.baseTexture.mipmap = true;

    this.backgroundSky.x = w / 2;
    this.backgroundSky.y = h / 2;

    this.backgroundSky.width = w;
    this.backgroundSky.height = h;

    this.app.stage.addChild(this.backgroundSky);

    this.backgroundSky.onComplete = () => {
      this.numberOfSky = changeSpriteInAnime(this.backgroundSky, 'ciel2_', this.numberOfSky, 3);
      this.backgroundSky.gotoAndPlay(0);
    };
  }

  // Animation when you click on chest
  clickChest(chests: IChest[]) {
    if (this.ship.chest.numberOfChest > 0) {
      const tempSprite: any = this.ship.chest.spriteChestParent.children;
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
          tempSprite[3].addChild(this.ship.chest.spriteTextChest);
          const xTemp = -50;
          const yTemp = -10;

          let tempChest = chests[this.ship.chest.numberOfChest - 1].reward1;
          this.ship.chest.openChestText(0, xTemp - 42, yTemp + 12,
            Object.keys(tempChest)[0], tempChest[Object.keys(tempChest)[0]]);

          tempChest = chests[this.ship.chest.numberOfChest - 1].reward2;
          this.ship.chest.openChestText(0, xTemp + 27, yTemp - 25, Object.keys(tempChest)[0], tempChest[Object.keys(tempChest)[0]]);

          tempChest = chests[this.ship.chest.numberOfChest - 1].reward3;
          this.ship.chest.openChestText(0, xTemp + 90, yTemp + 20, Object.keys(tempChest)[0], tempChest[Object.keys(tempChest)[0]]);

          tempSprite[1].interactive = true;
          tempSprite[1].buttonMode = true;
          tempSprite[1].on('click', () => {
            this.ship.chest.spriteTextChest.destroy();
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

              delete this.ship.chest.spriteTextChest;

              tempSprite[2].onComplete = () => {
              };

              tempSprite[5].onComplete = () => {
                this.socketS.removeChest(chests.length);
              };
            };
          });

        };
      });
    }
  }

  animationGoodConfig(isBadConfig: boolean) {
    this.ship.research.allAnimBeginOrStop(isBadConfig);
    this.ship.engine.allAnimBeginOrStop(isBadConfig);
    this.ship.storage.allAnimBeginOrStop(isBadConfig);
    this.ship.mineRate.allAnimBeginOrStop(isBadConfig);
    if (isBadConfig) {
      this.backgroundSky.stop();
      this.ship.tourelle.stop();
    } else {
      this.backgroundSky.play();
      this.ship.tourelle.play();
    }
  }

}
