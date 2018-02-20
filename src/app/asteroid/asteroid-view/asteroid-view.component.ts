import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';

import { AsteroidSprite } from './asteroidSprite';
import { Drone, STATS_DRONE } from './drone';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService, IFrenzyInfo, IProfile, IUserUpgrade, IMiningInfo } from '../../shared/user/user.service';
import { ParticleBase } from '../../shared/pixiVisual/particleBase';
import { User } from '../../shared/user/user';
import { UpgradeType, Upgrade } from '../../ship/upgrade-class/upgrade';
import { getFramesFromSpriteSheet, initSprite, changeSpriteInAnime } from '../../loadAnimation';
import { Frenzy } from '../../shared/user/frenzy';
import { IAsteroid, AsteroidService } from '../asteroid.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { OreService, IOreAmounts } from '../../ore/ore.service';
import { ResourcesService } from '../../shared/resources/resources.service';
import { Vector2 } from '../../shared/utils';
import { SearchService, ISearch } from '../../search/search.service';
import { AsteroidPiecesManaged, IPieceAsteroid } from './asteroidPieceManaged';

export enum KEY_CODE {
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  RIGHT_ARROW = 39,
  DOWN_ARROW = 40,
  A_KEY = 65,
  E_KEY = 69
}

@Component({
  selector: 'app-asteroid-view',
  templateUrl: './asteroid-view.component.html',
  styleUrls: ['./asteroid-view.component.scss']
})

export class AsteroidViewComponent implements OnInit {
  yLaser: number;
  xLaser: number;

  delta: number;
  coefClick: number;
  frenzyMOD: boolean;
  storageCapacityMax: number;

  private app: PIXI.Application;
  private asteroidSprite: AsteroidSprite;
  private asteroid: IAsteroid;
  private drone: Drone;
  private emitter: ParticleBase;

  private backgroundSky: PIXI.extras.AnimatedSprite;
  private numberOfSky: number;

  private boolKeyboard = true;
  private boolKeyboardFirst = true;
  private clicks: number[];

  private userMineRateLvl = 1;
  public clicked: boolean;

  private numberOfClick = 0;

  private asteroidPiecesManaged: AsteroidPiecesManaged;

  private frenzyInfo: IFrenzyInfo = {
    state: 0,
    nextCombos: {}
  };

  constructor(private el: ElementRef,
    private render: Renderer2,
    private userS: UserService,
    private asteroidS: AsteroidService,
    private resourcesS: ResourcesService,
    private socketS: SocketService,
    private oreS: OreService,
    private searchS: SearchService) { }

  ngOnInit(): void {
    this.clicks = new Array();
    this.subjectManage();

    setInterval(() => {
      if (this.asteroid != null
        && this.asteroid.currentCapacity > 0
        && !((this.asteroid.currentCapacity - this.asteroid.collectible) < 0.01)) {

        const amounts = parseFloat((this.resourcesS.mineRate[this.userMineRateLvl].baseRate *
          this.asteroid.purity / 100 *
          this.resourcesS.oreInfos[this.asteroid.ore].miningSpeed).toFixed(2));
        this.socketS.breakIntoCollectible(amounts);

        this.socketS.updateClickGauge(this.numberOfClick);
        this.xLaser = -Math.cos(this.drone.drone.rotation - Math.PI / 2) * this.drone.laserAnim.height * this.drone.laserAnim.scale.y + this.drone.xBaseDrone;
        this.yLaser = -Math.sin(this.drone.drone.rotation - Math.PI / 2) * this.drone.laserAnim.height * this.drone.laserAnim.scale.y;
        this.generatePieceCall(this.asteroid.ore, amounts, this.xLaser, this.yLaser);
        this.numberOfClick = 0;
      } else {
        this.drone.isMining = false;
      }
    }, 1000);

    this.userS.getUpgradeByName('mineRate').subscribe((upgrade: IUserUpgrade) => {
      this.userMineRateLvl = upgrade.lvl;
      this.initNumberOfDroneBegin();
    });
    // setInterval(() => { this.updateClick(); }, 100);
  }

  // tslint:disable-next-line:member-ordering
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KEY_CODE.A_KEY:
        if (this.boolKeyboard || this.boolKeyboardFirst) {
          this.boolKeyboard = false;
          this.boolKeyboardFirst = false;
        }
        break;
      case KEY_CODE.E_KEY:
        if (!this.boolKeyboard) {
          this.boolKeyboard = true;
          this.boolKeyboardFirst = false;
          this.asteroidClick();
        }
        break;
      case KEY_CODE.RIGHT_ARROW:
        this.frenzyModTouch(KEY_CODE.RIGHT_ARROW);
        break;
      case KEY_CODE.LEFT_ARROW:
        this.frenzyModTouch(KEY_CODE.LEFT_ARROW);
        break;
      case KEY_CODE.UP_ARROW:
        this.frenzyModTouch(KEY_CODE.UP_ARROW);
        break;
      case KEY_CODE.DOWN_ARROW:
        this.frenzyModTouch(KEY_CODE.DOWN_ARROW);
        break;
    }
  }

  @HostListener('window:resize') onResize() {
    // Detroy
    this.app.stage.removeChildren();
    this.render.removeChild(this.el.nativeElement, this.app.view);
    this.asteroidPiecesManaged.asteroidPiecesManagedsubject.unsubscribe();

    delete this.asteroidPiecesManaged;
    delete this.asteroidSprite;
    delete this.drone;

    this.app.destroy();

    // Create
    this.app = new PIXI.Application(this.el.nativeElement.offsetWidth, this.el.nativeElement.offsetHeight, { backgroundColor: 0x1079bb });
    this.render.appendChild(this.el.nativeElement, this.app.view);

    this.initAsteroid(this.asteroid);

    this.initNumberOfDroneBegin();
    this.drone.statsActu = STATS_DRONE.MINING;

    this.asteroidPiecesManaged = new AsteroidPiecesManaged(this.app);
    this.asteroidPiecesManaged.asteroidPiecesManagedsubject.subscribe((Ipieces: IPieceAsteroid) => {
      this.socketS.pickUpCollectible(Ipieces.namePieces, Ipieces.values);
    });
    this.initPieceOfDrone();
  }

  // Init the sprite of the asteroid
  private initAsteroid(newAste: IAsteroid) {
    const w = this.el.nativeElement.offsetWidth;
    const h = this.el.nativeElement.offsetHeight;
    this.delta = 0;
    // skyV1
    this.initSky(w, h);

    this.asteroidSprite = new AsteroidSprite(w, h, this.app, newAste);

    this.asteroidSprite.asteroid[0].on('click', (event) => {
      this.asteroidClick();
    });

    this.tickerApp();

    this.asteroidSprite.activEvent();
    this.clickCapsule();

    this.initializeEmmiter();
  }

  // Managed the Subject
  subjectManage() {
    const w = this.el.nativeElement.offsetWidth;
    const h = this.el.nativeElement.offsetHeight;
    this.app = new PIXI.Application(w, h, { backgroundColor: 0x1079bb });
    this.render.appendChild(this.el.nativeElement, this.app.view);
    this.initNumberOfDroneBegin();
    this.xLaser = -Math.cos(this.drone.drone.rotation - Math.PI / 2) * this.drone.laserAnim.height * this.drone.laserAnim.scale.y + this.drone.xBaseDrone;
    this.yLaser = -Math.sin(this.drone.drone.rotation - Math.PI / 2) * this.drone.laserAnim.height * this.drone.laserAnim.scale.y;

    this.asteroidPiecesManaged = new AsteroidPiecesManaged(this.app);

    this.asteroidPiecesManaged.asteroidPiecesManagedsubject.subscribe((Ipieces: IPieceAsteroid) => {
      this.socketS.pickUpCollectible(Ipieces.namePieces, Ipieces.values);
    });

    // All Subject
    this.asteroidS.asteroid$.take(1).subscribe((asteroid: IAsteroid) => {

      this.initAsteroid(asteroid);
      this.asteroid = asteroid;

      this.initPieceOfDrone();

      // Asteroid Subject
      this.asteroidS.asteroid$.subscribe((iasteroid: IAsteroid) => {
        this.drone.isMining = false;

        const state = this.asteroidSprite.computeState(iasteroid);

        if (this.asteroidSprite.state !== -1 && state === -1) {
          this.asteroidSprite.destructBase();
        }

        if (state < this.asteroidSprite.state && state !== -1) {
          this.asteroidSprite.destructOnePart();
        }

        if (iasteroid.currentCapacity > this.asteroid.currentCapacity) {
          this.asteroidSprite.changeSprite(iasteroid);
          this.drone.laserAnim.visible = true;
        }
        this.asteroid = iasteroid;
        this.oreS.OreAmounts
          .take(1).subscribe((oreAmount: IOreAmounts) => {
            this.drone.setIsUserHaveMaxCapacityStorage(this.asteroid && oreAmount[this.asteroid.ore] >= this.storageCapacityMax);
          });

        this.drone.droneMiningVerif();

      });

      // Asteroid is empty
      this.asteroidS.isEmpty.subscribe((isEmpty: boolean) => {
        this.drone.setIsAsteLifeSupZero(!isEmpty);
      });

      // Event Subject
      this.userS.event.subscribe((hasEvent: number) => {
        if (this.asteroidSprite) {
          this.asteroidSprite.eventOk = hasEvent;
          this.asteroidSprite.activEvent();
          this.clickCapsule();
        }
      });


      // frenzy Subject
      this.userS.frenzyInfo.subscribe((frenzy: IFrenzyInfo) => {
        this.frenzyInfo = frenzy;
        this.frenzyModGoOrNot(frenzy);
      });
      // Profile Subject
      this.userS.profile.subscribe((profile: IProfile) => {
        profile.badConfig ? this.backgroundSky.stop() : this.backgroundSky.play();
      });

      // Mining info for CLickgauge
      this.userS.miningInfo.subscribe((info: IMiningInfo) => {
        this.userS.localClickGauge = info.clickGauge + this.numberOfClick;
        this.userS.localClickGaugeSubject.next(this.userS.localClickGauge);
        this.asteroidSprite.shakeCoef = this.userS.localClickGauge * 10;
      });

      // Upgrade Subject Minerate
      this.userS.getUpgradeByName('mineRate').subscribe((upgrade: IUserUpgrade) => {
        const tempLvl = upgrade.lvl;
        this.drone.changeSpriteDrone(upgrade.lvl);
      });

      // Upgrade Subject Storage
      this.userS.getUpgradeByName('storage')
        .subscribe((userUpgrade) => {
          this.storageCapacityMax = this.resourcesS[userUpgrade.name][userUpgrade.lvl].capacity;
        });

      // Search
      this.searchS.search.subscribe((search: ISearch) => {
        if (search.state === 3) {
          this.drone.statsActu = STATS_DRONE.GO_OUT;
          this.asteroidPiecesManaged.pieceGoAway();
        }
      });

      // User ore amounts
      this.oreS.OreAmounts
        .subscribe((oreAmount: IOreAmounts) => {
          this.drone.setIsUserHaveMaxCapacityStorage(this.asteroid && oreAmount[this.asteroid.ore] >= this.storageCapacityMax);
        });

    });
  }

  // Managed the click in asteroid
  asteroidClick() {
    // ga('asteroid.send', 'event', 'buttons', 'click', 'asteroid');

    this.numberOfClick++;
    this.userS.localClickGauge++;
    if (this.userS.localClickGauge >= 50) {
      const amounts = parseFloat((
        this.resourcesS.mineRate[this.userMineRateLvl].baseRate *
        this.asteroid.purity / 100 *
        this.resourcesS.oreInfos[this.asteroid.ore].miningSpeed).toFixed(2));


      for (let i = 0; i < 10; i++) {
        this.generatePieceCall(this.asteroid.ore, amounts, this.xLaser, this.yLaser);
      }
      this.asteroidSprite.clickExplosion();
      this.userS.localClickGauge = 0;
    }
    this.asteroidSprite.shakeCoef = this.userS.localClickGauge * 10;
    this.userS.localClickGaugeSubject.next(this.userS.localClickGauge);
    this.clicks.push(Date.now());

  }

  updateClick() {

    const max = this.resourcesS.mineRate[this.userMineRateLvl].maxRate;
    const base = this.resourcesS.mineRate[this.userMineRateLvl].baseRate;

    const clickTmp = this.clicks;
    for (let i = 0; i < clickTmp.length; i++) {
      if (Date.now() - clickTmp[i] > 2000) {
        this.clicks.splice(this.clicks.indexOf(clickTmp[i]), 1);
      }
    }

    this.coefClick = this.clicks.length / 16;
    const newRate = base + ((max - base) * this.coefClick);

    if (this.coefClick >= 1) {
      // this.socketS.reachFrenzy();
    }
    if (!this.frenzyMOD) {
      if (this.coefClick > 0.5) {
        this.drone.activeLaser();
        this.drone.laserAnim.visible = false;
        if (this.asteroidSprite) {
          this.asteroidSprite.checkAstero = true;
        }
      } else {
        this.drone.desactivLaser();
        if (this.asteroidSprite) {
          this.asteroidSprite.checkAstero = false;
        }
      }
    }
  }


  initializeEmmiter() {
    const config = {
      'alpha': {
        'start': 1,
        'end': 1
      },
      'scale': {
        'start': 1,
        'end': 0
      },
      'color': {
        'start': 'ffffff',
        'end': 'ffffff'
      },
      'speed': {
        'start': 300,
        'end': 100
      },
      'startRotation': {
        'min': 0,
        'max': 360
      },
      'rotationSpeed': {
        'min': 0,
        'max': 0
      },
      'lifetime': {
        'min': 0.5,
        'max': 0.5
      },
      'frequency': 0.008,
      'emitterLifetime': 0.20,
      'maxParticles': 1000,
      'pos': {
        'x': 0,
        'y': 0
      },
      'addAtBack': false,
      'spawnType': 'circle',
      'spawnCircle': {
        'x': 0,
        'y': 0,
        'r': 0
      }
    };

    this.emitter = new ParticleBase(
      this.app.stage,
      PIXI.Texture.fromImage('assets/smallRock.png'),
      config
    );
    this.emitter.updateOwnerPos(this.asteroidSprite.asteroid[0].x, this.asteroidSprite.asteroid[0].y);
  }

  // initial sky animated Sprite
  initSky(w, h) {
    this.numberOfSky = 1;
    this.backgroundSky = initSprite('ciel3_1', 500, 500, true, false, 0.32);
    this.backgroundSky.gotoAndPlay(0);
    this.backgroundSky.loop = false;
    this.backgroundSky.texture.baseTexture.mipmap = true;

    this.backgroundSky.x = w / 2;
    this.backgroundSky.y = h / 2;

    this.backgroundSky.width = w;
    this.backgroundSky.height = h;
    this.backgroundSky.name = 'backgroundSky';
    this.app.stage.addChildAt(this.backgroundSky, 0);

    this.backgroundSky.onComplete = () => {
      this.numberOfSky = changeSpriteInAnime(this.backgroundSky, 'ciel3_', this.numberOfSky, 3);
      this.backgroundSky.gotoAndPlay(0);
    };
  }

  // MANAGED EVENT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  clickCapsule() {
    if (this.asteroidSprite.eventOk === 1) {
      const tempSprite: any = this.asteroidSprite.spriteEventParent.children;
      tempSprite[0].interactive = true;
      tempSprite[0].buttonMode = true;
      tempSprite[0].on('click', (event) => {
        tempSprite[0].visible = false;
        tempSprite[1].visible = true;
        tempSprite[2].visible = true;
        tempSprite[1].gotoAndPlay(0);
        tempSprite[2].gotoAndPlay(0);
        tempSprite[2].onComplete = () => {
          this.socketS.newChest();
          this.socketS.deleteEvent();
        };
      });
    }
  }

  /*
  * MOD FRENZY MANAGED - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  */
  frenzyModGoOrNot(frenzy) {
    if (!frenzy.state) {
      this.frenzyMOD = false;
      frenzy.comboInd = 0;
      this.asteroidSprite.frenzyModTouchDown();
      this.drone.statsActu = STATS_DRONE.MINING;
      this.asteroidSprite.frenzyModComboFinish();
    } else {
      this.frenzyMOD = true;
      this.drone.delta = 0;
      this.asteroidSprite.frenzyBackgroundStart();
      this.drone.statsActu = STATS_DRONE.MOD_FRENZY;
      this.asteroidSprite.checkAstero = true;
      this.asteroidSprite.frenzyModTouch(frenzy.nextCombos[0]);
      this.drone.frenzyTouchX = this.asteroidSprite.posXArrow + 40;
      this.drone.frenzyTouchY = this.asteroidSprite.posYArrow - 150;
    }
  }

  // frenzy Touch
  frenzyModTouch(numTouchUserActu: number) {
    if (this.frenzyInfo.state) {
      this.socketS.validArrow(numTouchUserActu - 37, this.userS.localFrenzyInd);
      if (this.frenzyInfo.nextCombos[this.userS.localFrenzyInd] === (numTouchUserActu - 37)) {
        this.userS.localFrenzyInd++;
        this.asteroidSprite.frenzyModTouch(this.frenzyInfo.nextCombos[this.userS.localFrenzyInd]);
        this.drone.frenzyTouchX = this.asteroidSprite.posXArrow + 50;
        this.drone.frenzyTouchY = this.asteroidSprite.posYArrow - 150;
      } else {
        this.coefClick = 0;
        this.clicks = new Array();
        this.asteroidSprite.frenzyFail();
      }
    } else {
      this.asteroidSprite.frenzyModComboFinish();
    }
  }

  // Manage Drone - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  initNumberOfDroneBegin() {
    if (!this.drone) {
      this.drone = new Drone(0.20, 0.20, 1, 1, false, this.app);
    }
    this.drone.changeSpriteDrone(this.userMineRateLvl);
  }

  /*
  * MANAGED PIECE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  */
  generatePieceCall(oreName: string, values, _x: number, _y: number) {
    if (this.drone.isUserHaveMaxCapacityStorage) {
      this.asteroidPiecesManaged.addTextToPiecetext('Stock Max', '0xFF0000');
      return;
    }

    if (this.asteroidPiecesManaged.asteroidPieceParent.children.length === 250) {
      this.socketS.pickUpCollectible(oreName, values);
      this.asteroidPiecesManaged.addTextToPiecetext('+' + values, '0xffc966');
      return;
    }

    this.asteroidPiecesManaged.generatePiece(oreName, values, _x, _y);
  }

  // Init piece of drone
  initPieceOfDrone() {
    if (this.asteroid.collectible > 0) {
      const amounts = parseFloat((this.resourcesS.mineRate[this.userMineRateLvl].baseRate *
        this.asteroid.purity / 100 *
        this.resourcesS.oreInfos[this.asteroid.ore].miningSpeed).toFixed(2));
      for (let i = 0; i < this.asteroid.collectible / amounts; i++) {
        this.generatePieceCall(this.asteroid.ore, amounts, this.xLaser, this.yLaser);
      }
    }
  }

  /*
  *  TICKER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  */
  tickerApp() {
    this.app.ticker.add((delta) => {
      if (this.delta > 2 * Math.PI) {
        this.delta = 0;
      }
      this.delta += (2 * Math.PI) / 1000;
      this.asteroidPiecesManaged.tickerAppPiece(this.delta, this.asteroid.collectible);
      this.asteroidSprite.tickerAppAsteroid();
    });
  }
}
