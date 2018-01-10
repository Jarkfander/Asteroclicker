import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';

import { AsteroidSprite } from './asteroidSprite';
import { Drone } from './drone';
import { UpgradeService } from '../../ship/upgrade-list/upgrade.service';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService } from '../../shared/user/user.service';
import { OreInfoService } from '../ore-info-view/ore-info.service';
import { Asteroid } from './asteroid';
import { ParticleBase } from '../../shared/pixiVisual/particleBase';
import { User } from '../../shared/user/user';
import { UpgradeType, Upgrade } from '../../ship/upgrade-class/upgrade';
import { getFramesFromSpriteSheet } from '../../loadAnimation';
import { Frenzy } from '../../shared/user/frenzy';
import { UpgradeLvls } from '../../ship/upgrade-list/upgrade-list.component';


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

export class AsteroidViewComponent implements AfterViewInit {
  private app: PIXI.Application;
  private asteroidSprite: AsteroidSprite;
  private asteroid: Asteroid;
  private state: number;
  private drone: Array<Drone>;
  private numOfDrone: number;
  private emitter: ParticleBase;

  private backgroundSky: PIXI.extras.AnimatedSprite;
  private numberOfSky: number;

  private boolKeyboard = true;
  private boolKeyboardFirst = true;
  private clicks: number[];

  clicked: boolean;

  constructor(private el: ElementRef, private render: Renderer2, private userS: UserService,
    private upgradeS: UpgradeService, private socketS: SocketService, private oreInfoS: OreInfoService) {
    this.asteroid = this.userS.currentUser.asteroid;
    this.state = this.asteroid.currentCapacity == this.asteroid.capacity ? 4 :
      Math.floor((this.asteroid.currentCapacity / this.asteroid.capacity) * 5);
  }

  ngAfterViewInit() {
    this.clicks = new Array();
    this.initAsteroid();
    setInterval(() => {
      this.socketS.incrementOre(this.userS.currentUser.uid, this.userS.currentUser.asteroid.ore,
        parseFloat((this.userS.currentUser.currentMineRate *
          this.userS.currentUser.asteroid.purity / 100 *
          this.oreInfoS.getOreInfoByString(this.userS.currentUser.asteroid.ore).miningSpeed).toFixed(2)));
    }, 1000);
    setInterval(() => { this.updateClick() }, 100);

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

    this.initAsteroid();
  }

  initAsteroid() {
    const w = this.el.nativeElement.parentElement.offsetWidth;
    const h = this.el.nativeElement.parentElement.offsetHeight;
    this.app = new PIXI.Application(w, h, { backgroundColor: 0x1079bb });
    this.render.appendChild(this.el.nativeElement, this.app.view);

    this.drone = new Array<Drone>();
    // skyV1
    this.numberOfSky = 1;
    this.initSky('skyV1_1', 500, 500, w, h);


    this.asteroidSprite = new AsteroidSprite(0.25, 0.25, this.app, this.userS.currentUser.asteroid,
      this.oreInfoS.oreInfo.length);

    this.asteroidSprite.asteroid[0].on('click', (event) => {
      this.asteroidClick();
    });


    this.asteroidSprite.eventOk = this.userS.currentUser.event;
    this.asteroidSprite.activEvent();
    this.clickCapsule();

    this.initNumberOfDroneBegin();

    this.userS.asteroidSubject.subscribe((user: User) => {

      const state = this.asteroid.currentCapacity === this.asteroid.capacity ? 4 :
        Math.floor((this.asteroid.currentCapacity / this.asteroid.capacity) * 5);

      if (user.asteroid.currentCapacity === 0 && this.asteroid.currentCapacity !== 0) {
        this.asteroidSprite.destructBase();
        this.miningDrone(true);
      }
      if (state < this.state) {
        this.asteroidSprite.destructOnePart();
        this.state = state;
      }

      if (state > this.state) {
        this.state = state;
      }

      if (user.asteroid.currentCapacity > this.asteroid.currentCapacity) {
        this.asteroidSprite.changeSprite(user.asteroid);
        this.miningDrone(false);
        this.miningLaser(true);
      }
      /*
      if (this.drone.laser != null) {
        this.drone.laser.visible = user[user.asteroid.ore] <
          this.upgradeS.storage[user.upgrades[UpgradeType.storage].lvl].capacity;
      }*/
      this.asteroid = user.asteroid;
    });

    this.userS.eventSubject.subscribe((user: User) => {
      this.asteroidSprite.eventOk = user.event;
      this.asteroidSprite.activEvent();
      this.clickCapsule();
    });

    this.userS.frenzySubjectState.subscribe((frenzy: Frenzy) => {
      if (!frenzy.state) {
        this.asteroidSprite.frenzyModTouchDown();
      } else {
        this.asteroidSprite.frenzyModTouch(frenzy.nextCombos[0]);
      }
    });

    this.userS.upgradeSubject.subscribe((user: User) => {
      const tempLvl = this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl;
      if (this.numOfDrone !== Math.floor(tempLvl / 40) + 1) {
        this.numOfDrone = Math.floor(tempLvl / 40) + 1;
        this.addNewDrone();
      }
      for (let i = 0; i < this.numOfDrone; i++) {
        this.drone[i].changeSpriteDrone(user.upgrades[UpgradeType.mineRate].lvl, i);
      }
    });

    this.initializeEmmiter();
  }

  asteroidClick() {
    // ga('asteroid.send', 'event', 'buttons', 'click', 'asteroid');
    if (!this.userS.currentUser.frenzy.state) {
      this.clicks.push(Date.now());
    }
  }

  updateClick() {
    const max = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].maxRate;
    const base = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].baseRate;

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
      for (let i = 0; i < this.numOfDrone; i++) {
        this.drone[i].activeLaser();
        this.drone[i].laserAnim.visible = false;
      }

      this.asteroidSprite.checkAstero = true;
    } else {
      for (let i = 0; i < this.numOfDrone; i++) {
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
    const stringSky: string = 'skyV1_' + this.numberOfSky;

    const tempBackground = getFramesFromSpriteSheet(PIXI.loader.resources[stringSky].texture, 500, 500);

    for (let i = 0; i < this.backgroundSky.textures.length; i++) {
      this.backgroundSky.textures[i] = tempBackground[i];
    }
    this.backgroundSky.gotoAndPlay(0);
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
    if (this.userS.currentUser.frenzy.state) {
      this.socketS.validArrow(this.userS.currentUser.uid, numTouchUserActu - 37, this.userS.currentUser.frenzy.comboInd);
      if (this.userS.currentUser.frenzy.nextCombos[this.userS.currentUser.frenzy.comboInd] == (numTouchUserActu - 37)) {
        this.userS.currentUser.frenzy.comboInd++;
        this.asteroidSprite.frenzyModTouch(this.userS.currentUser.frenzy.nextCombos[this.userS.currentUser.frenzy.comboInd]);

      }
    }
  }

  // Manage lot of drone - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  initNumberOfDroneBegin() {
    const tempLvl = this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl;
    this.numOfDrone = Math.floor(tempLvl / 40) + 1;
    let random = 1;

    for (let i = 0; i < this.numOfDrone; i++) {
      random = (Math.floor(Math.random() * 4) + 1) * 0.01;
      this.drone.push(new Drone(0.20 - random, 0.20 - random, 1, 1, this.app));
      this.drone[i].isMining = this.asteroid.currentCapacity === 0;
      this.drone[i].deltaTempAster = (i / 3) * (2 * Math.PI) / 1000;
      this.drone[i].changeSpriteDrone(tempLvl, i);
      this.drone[i].laserFirstState = this.userS.currentUser.oreAmounts[this.userS.currentUser.asteroid.ore];
    }
  }

  miningDrone(booltemp: boolean) {
    for (let i = 0; i < this.numOfDrone; i++) {
      this.drone[i].isMining = booltemp;
    }
  }

  addNewDrone() {
    const tempLvl = this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl;
    const random = (Math.floor(Math.random() * 4) + 1) * 0.01;

    this.drone.push(new Drone(0.20 - random, 0.20 - random, 1, 1, this.app));
    this.drone[this.numOfDrone - 1].deltaTempAster = ((this.numOfDrone - 1) / 3) * (2 * Math.PI) / 1000;
    this.drone[this.numOfDrone - 1].laserAnim.visible = this.drone[0].laserAnim.visible;
    this.drone[this.numOfDrone - 1].isMining = this.drone[0].isMining;
    this.drone[this.numOfDrone - 1].laserFirstState = this.userS.currentUser.oreAmounts[this.userS.currentUser.asteroid.ore];
  }

  miningLaser(booltemp: boolean) {
    for (let i = 0; i < this.numOfDrone; i++) {
      this.drone[i].laserAnim.visible = booltemp;
    }
  }

}
