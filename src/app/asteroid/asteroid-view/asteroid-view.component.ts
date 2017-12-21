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
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { getFramesFromSpriteSheet } from '../../loadAnimation';



@Component({
  selector: 'app-asteroid-view',
  templateUrl: './asteroid-view.component.html',
  styleUrls: ['./asteroid-view.component.scss']
})

export class AsteroidViewComponent implements AfterViewInit {
  constructor(private el: ElementRef, private render: Renderer2, private userS: UserService,
    private upgradeS: UpgradeService, private socketS: SocketService, private oreInfoS: OreInfoService) {
    this.asteroid = this.userS.currentUser.asteroid;
    this.state = this.asteroid.currentCapacity == this.asteroid.capacity ? 4 :
      Math.floor((this.asteroid.currentCapacity / this.asteroid.capacity) * 5);
  }

  private app: PIXI.Application;
  private asteroidSprite: AsteroidSprite;
  private asteroid: Asteroid;
  private state: number;
  private drone: Drone;
  private emitter: ParticleBase;

  private backgroundSky: PIXI.extras.AnimatedSprite;
  private numberOfSky: number;

  private clicks: number[];

  clicked: boolean;

  ngAfterViewInit() {
    this.clicks = new Array();
    this.initAsteroid();
    setInterval(() => {
      this.socketS.incrementOre(this.userS.currentUser.asteroid.ore,
        parseFloat((this.userS.currentUser.currentMineRate *
          this.userS.currentUser.asteroid.purity / 100 *
          this.oreInfoS.getOreInfoByString(this.userS.currentUser.asteroid.ore).miningSpeed).toFixed(2)));
    }, 1000);
    setInterval(() => { this.updateClick() }, 100);

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

    // skyV1
    this.numberOfSky = 1;
    this.initSky('skyV1_1', 500, 500, w, h);

    this.drone = new Drone(0.20, 0.20, this.app);
    this.drone.isMining = this.asteroid.currentCapacity === 0;

    this.asteroidSprite = new AsteroidSprite(0.25, 0.25, this.app, this.userS.currentUser.asteroid,
      this.oreInfoS.oreInfo.length);

    this.asteroidSprite.asteroid[0].on('click', (event) => {
      this.asteroidClick();
    });

    /*for (let i = 0; i < this.asteroidSprite.asteroid.length; i++) {
      this.asteroidSprite.asteroid[i].on('click', (event) => {
        this.asteroidClick();
        console.log(this.asteroidSprite.asteroid[i]);
      });
    }*/


    this.asteroidSprite.eventOk = this.userS.currentUser.event;
    this.asteroidSprite.activEvent();
    this.clickCapsule();
    //this.asteroidSprite.initAnimationFxClick(w, h);

    this.drone.laserFirstState = this.userS.currentUser.oreAmounts[this.userS.currentUser.asteroid.ore]

    this.userS.asteroidSubject.subscribe((user: User) => {

      const state = this.asteroid.currentCapacity === this.asteroid.capacity ? 4 :
        Math.floor((this.asteroid.currentCapacity / this.asteroid.capacity) * 5);

      if (user.asteroid.currentCapacity === 0 && this.asteroid.currentCapacity !== 0) {
        this.asteroidSprite.destructBase();
        this.drone.isMining = true;
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
        this.drone.isMining = false;
        this.drone.laserAnim.visible = true;
      }
      if (this.drone.laser != null) {
        this.drone.laser.visible = user[user.asteroid.ore] <
          this.upgradeS.storage[user.upgrades[UpgradeType.storage].lvl].capacity;
      }
      this.asteroid = user.asteroid;
    });

    this.userS.eventSubject.subscribe((user: User) => {
      this.asteroidSprite.eventOk = user.event;
      this.asteroidSprite.activEvent();
      this.clickCapsule();
    });
    this.initializeEmmiter();
  }

  asteroidClick() {
    // ga('asteroid.send', 'event', 'buttons', 'click', 'asteroid');
    this.clicks.push(Date.now());
  }

  updateClick() {
    const max = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].maxRate;
    const base = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].baseRate;

    let clickTmp = this.clicks;
    for (let i = 0; i < clickTmp.length; i++) {
      if (Date.now() - clickTmp[i] > 2000) {
        this.clicks.splice(this.clicks.indexOf(clickTmp[i]), 1);
      }
    }


    const coefClick = this.clicks.length / 16;
    const newRate = base + ((max - base) * coefClick);
    this.userS.modifyCurrentMineRate(newRate <= max ? newRate : max);

    if (coefClick > 0.6) {
      this.drone.activeLaser();
      this.drone.laserAnim.visible = false;
      this.asteroidSprite.checkAstero = true;
    }
    else {
      this.drone.desactivLaser();
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
          this.socketS.newChest();
          this.socketS.deleteEvent();
        };
      });
    }
  }
}
