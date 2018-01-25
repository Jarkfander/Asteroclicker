import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';

import { AsteroidSprite } from './asteroidSprite';
import { Drone } from './drone';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService, IFrenzyInfo, IProfile, IUpgrades, IUpgrade } from '../../shared/user/user.service';
import { ParticleBase } from '../../shared/pixiVisual/particleBase';
import { User } from '../../shared/user/user';
import { UpgradeType, Upgrade } from '../../ship/upgrade-class/upgrade';
import { getFramesFromSpriteSheet, initSprite, changeSpriteInAnime } from '../../loadAnimation';
import { Frenzy } from '../../shared/user/frenzy';
import { UpgradeService } from '../../ship/upgrade.service';
import { IAsteroid, AsteroidService } from '../asteroid.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { OreService, IOreInfos } from '../../ore/ore.service';


export enum KEY_CODE {
  RIGHT_ARROW = 39,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  LEFT_ARROW = 37
}

@Component({
  selector: 'app-asteroid-view',
  templateUrl: './asteroid-view.component.html',
  styleUrls: ['./asteroid-view.component.scss']
})

export class AsteroidViewComponent implements OnInit {

  private app: PIXI.Application;
  private asteroidSprite: AsteroidSprite;
  private asteroid: IAsteroid;
  private state: number;
  private drone: Array<Drone>;
  private emitter: ParticleBase;

  private backgroundSky: PIXI.extras.AnimatedSprite;
  private numberOfSky: number;

  private boolKeyboard = true;
  private boolKeyboardFirst = true;
  private clicks: number[];

  private userMineRateLvl = 1;
  public clicked: boolean;

  private frenzyInfo: IFrenzyInfo = {
    state: 0,
    nextCombos: {}
  };

  constructor(private el: ElementRef,
    private render: Renderer2,
    private userS: UserService,
    private asteroidS: AsteroidService,
    private upgradeS: UpgradeService,
    private socketS: SocketService,
    private oreS: OreService) { }

  ngOnInit(): void {
    this.clicks = new Array();
    this.subjectManage();

    this.oreS.OreInfos.take(1).subscribe((oreInfos: IOreInfos) => {
      setInterval(() => {
        if (this.asteroid != null && this.asteroid.currentCapacity > 0) {
          this.socketS.incrementOre(this.userS.currentUser.uid, this.asteroid.ore,
            parseFloat((this.userS.currentUser.currentMineRate *
              this.asteroid.purity / 100 *
              oreInfos[this.asteroid.ore].miningSpeed).toFixed(2)));
        }
      }, 1000);
      this.userS.getUpgradeByName("mineRate").subscribe((upgrade: IUpgrade) => {
        this.userMineRateLvl = upgrade.lvl;
        this.initNumberOfDroneBegin();
      });
      setInterval(() => { this.updateClick(); }, 100);
    });
  }

  // tslint:disable-next-line:member-ordering
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.frenzyModTouch(KEY_CODE.RIGHT_ARROW);
      if (this.boolKeyboard || this.boolKeyboardFirst) {
        this.boolKeyboard = false;
        this.boolKeyboardFirst = false;
      }

    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.frenzyModTouch(KEY_CODE.LEFT_ARROW);
      if (!this.boolKeyboard) {
        this.boolKeyboard = true;
        this.boolKeyboardFirst = false;
        this.asteroidClick();
      }
    }
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.frenzyModTouch(KEY_CODE.UP_ARROW);
    }
    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.frenzyModTouch(KEY_CODE.DOWN_ARROW);
    }
  }

  @HostListener('window:resize') onResize() {
    this.app.stage.removeChildren();
    this.render.removeChild(this.el.nativeElement, this.app.view);
    delete this.asteroidSprite;
    this.app.destroy();
    this.initAsteroid(this.asteroid);
    this.initNumberOfDroneBegin();
  }

  private initAsteroid(newAste: IAsteroid) {
    const w = this.el.nativeElement.offsetWidth;
    const h = this.el.nativeElement.offsetHeight;
    this.app = new PIXI.Application(w, h, { backgroundColor: 0x1079bb });
    this.render.appendChild(this.el.nativeElement, this.app.view);

    this.drone = new Array<Drone>();
    // skyV1
    this.initSky(w, h);

    this.asteroidSprite = new AsteroidSprite(w, h, this.app, newAste);

    this.asteroidSprite.asteroid[0].on('click', (event) => {
      this.asteroidClick();
    });


    this.asteroidSprite.eventOk = this.userS.currentUser.event;
    this.asteroidSprite.activEvent();
    this.clickCapsule();

    this.initializeEmmiter();
  }

  // Subject
  subjectManage() {
    // Asteroid Subject

    this.asteroidS.asteroid.subscribe((asteroid: IAsteroid) => {
      if (this.asteroid == null) {
        this.initAsteroid(asteroid);
        this.asteroid = asteroid;
      }

      const state = asteroid.currentCapacity === asteroid.capacity ? 4 :
        Math.floor((asteroid.currentCapacity / asteroid.capacity) * 5);

      if (asteroid.currentCapacity === 0 && this.asteroid.currentCapacity !== 0) {
        this.asteroidSprite.destructBase();
      }

      if (state < this.state) {
        this.asteroidSprite.destructOnePart();
      }

      this.state = state;

      if (asteroid.currentCapacity > this.asteroid.currentCapacity) {
        this.asteroidSprite.changeSprite(asteroid);
        this.miningLaser(true);
      }
      this.asteroid = asteroid;
    });

    this.asteroidS.isEmpty.subscribe((isEmpty: boolean) => {
      this.miningDrone(!isEmpty);
    });

    // Event Subject
    this.userS.eventSubject.subscribe((user: User) => {
      this.asteroidSprite.eventOk = user.event;
      this.asteroidSprite.activEvent();
      this.clickCapsule();
    });

    // frenzy Subject
    this.userS.frenzyInfo.subscribe((frenzy: IFrenzyInfo) => {
      this.frenzyInfo = frenzy;
      if (!frenzy.state) {
        this.asteroidSprite.frenzyModTouchDown();
        this.asteroidSprite.frenzyModComboFinish();
      } else {
          this.asteroidSprite.frenzyBackgroundStart();
          this.asteroidSprite.frenzyModTouch(frenzy.nextCombos[0]);
      }
    });

    // Profile Subject
    this.userS.profile.subscribe((profile: IProfile) => {
      profile.badConfig ? this.backgroundSky.stop() : this.backgroundSky.play();
    });

    // Upgrade Subject
    this.userS.upgrade.subscribe((upgrade: IUpgrades) => {
      const tempLvl = upgrade.mineRate.lvl;
      if (this.drone.length !== Math.floor(tempLvl / 40) + 1) {
        this.addNewDrone();
      }
      for (let i = 0; i < this.drone.length; i++) {
        if (this.drone[i]) {
          this.drone[i].changeSpriteDrone(upgrade.mineRate.lvl, i);
        }
      }
    });
  }

  asteroidClick() {
    // ga('asteroid.send', 'event', 'buttons', 'click', 'asteroid');
    if (!this.userS.currentUser.frenzy.state) {
      this.clicks.push(Date.now());
    }
  }

  updateClick() {
    const max = this.upgradeS.mineRate[this.userMineRateLvl].maxRate;
    const base = this.upgradeS.mineRate[this.userMineRateLvl].baseRate;

    const clickTmp = this.clicks;
    for (let i = 0; i < clickTmp.length; i++) {
      if (Date.now() - clickTmp[i] > 2000) {
        this.clicks.splice(this.clicks.indexOf(clickTmp[i]), 1);
      }
    }

    const coefClick = this.clicks.length / 16;
    const newRate = base + ((max - base) * coefClick);
    this.userS.modifyCurrentMineRate(newRate <= max ? newRate : max);

    if (coefClick >= 1) {
      this.socketS.reachFrenzy(this.userS.currentUser.uid);
    }

    if (coefClick > 0.5) {
      for (let i = 0; i < this.drone.length; i++) {
        this.drone[i].activeLaser();
        this.drone[i].laserAnim.visible = false;
      }

      this.asteroidSprite.checkAstero = true;
    } else {
      for (let i = 0; i < this.drone.length; i++) {
        this.drone[i].desactivLaser();
      }
      this.asteroidSprite.checkAstero = false;
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
    this.backgroundSky = initSprite('ciel3_1', 500, 500, true, this.userS.currentUser.boolBadConfig, 0.32);
    this.backgroundSky.gotoAndPlay(0);
    this.backgroundSky.loop = false;
    this.backgroundSky.texture.baseTexture.mipmap = true;

    this.backgroundSky.x = w / 2;
    this.backgroundSky.y = h / 2;

    this.backgroundSky.width = w;
    this.backgroundSky.height = h;

    this.app.stage.addChild(this.backgroundSky);

    this.backgroundSky.onComplete = () => {
      this.numberOfSky = changeSpriteInAnime(this.backgroundSky, 'ciel3_', this.numberOfSky, 3);
      this.backgroundSky.gotoAndPlay(0);
    };
  }

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
          this.socketS.newChest(this.userS.currentUser.uid);
          this.socketS.deleteEvent(this.userS.currentUser.uid);
        };
      });
    }
  }

  // frenzy mod
  frenzyModTouch(numTouchUserActu: number) {
    if (this.frenzyInfo.state) {
      this.socketS.validArrow(this.userS.currentUser.uid, numTouchUserActu - 37, this.userS.currentUser.frenzy.comboInd);
      if (this.frenzyInfo.nextCombos[this.userS.currentUser.frenzy.comboInd] === (numTouchUserActu - 37)) {
        this.userS.currentUser.frenzy.comboInd++;
        this.asteroidSprite.frenzyModTouch(this.frenzyInfo.nextCombos[this.userS.currentUser.frenzy.comboInd]);
      } else {
        this.asteroidSprite.frenzyFail();
      }
    } else {
        this.asteroidSprite.frenzyModComboFinish();
    }
  }

  // Manage lot of drone - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  initNumberOfDroneBegin() {
    let random = 1;
    const numOfDrone = this.userS.currentUser.boolBadConfig ? 1 : Math.floor(this.userMineRateLvl / 50) + 1;

    for (let i = 0; i < numOfDrone; i++) {
      random = (Math.floor(Math.random() * 4) + 1) * 0.01;
      this.drone.push(new Drone(0.20 - random, 0.20 - random, 1, 1, this.app));
      this.drone[i].deltaTempAster = (i / 3) * (2 * Math.PI) / 1000;
      this.drone[i].changeSpriteDrone(this.userMineRateLvl, i);
    }
  }

  miningDrone(booltemp: boolean) {
    for (let i = 0; i < this.drone.length; i++) {
      this.drone[i].isMining = booltemp;
    }
  }

  addNewDrone() {
    if (this.userS.currentUser.boolBadConfig) {
      return;
    }
    const tempLvl = this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl;
    const random = (Math.floor(Math.random() * 4) + 1) * 0.01;
    this.drone.push(new Drone(0.20 - random, 0.20 - random, 1, 1, this.app));
    this.drone[this.drone.length - 1].deltaTempAster = ((this.drone.length - 1) / 3) * (2 * Math.PI) / 1000;
    this.drone[this.drone.length - 1].laserAnim.visible = this.drone[0].laserAnim.visible;
    this.drone[this.drone.length - 1].isMining = this.drone[0].isMining;
  }

  miningLaser(booltemp: boolean) {
    for (let i = 0; i < this.drone.length; i++) {
      this.drone[i].laserAnim.visible = booltemp;
    }
  }

}
