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
  clicked: boolean;

  ngAfterViewInit() {
    this.initAsteroid();


    setInterval(() => {
      this.socketS.incrementOre(this.userS.currentUser.asteroid.ore,
        parseFloat((this.userS.currentUser.currentMineRate *
          this.userS.currentUser.asteroid.purity / 100 *
          this.oreInfoS.getOreInfoByString(this.userS.currentUser.asteroid.ore).miningSpeed).toFixed(2)));
    }, 1000);
    setInterval(() => { this.resetClick() }, 200);

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

    const background = PIXI.Sprite.fromImage('assets/Ciel.jpg');
    background.width = this.app.renderer.width;
    background.height = this.app.renderer.height;
    this.app.stage.addChild(background);

    this.drone = new Drone(0.20, 0.20, this.app);
    this.drone.isMining = this.asteroid.currentCapacity === 0;

    this.asteroidSprite = new AsteroidSprite(0.25, 0.25, this.app, this.userS.currentUser.asteroid,
      this.oreInfoS.oreInfo.length);

    for (let i = 0; i < this.asteroidSprite.asteroid.length; i++) {
      this.asteroidSprite.asteroid[i].on('click', (event) => {
        this.asteroidClick();
      });
    }

    this.drone = new Drone(0.20, 0.20, this.app);
    this.drone.isMining = this.asteroid.currentCapacity === 0;

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
          this.upgradeS.storage[user.storageLvl].capacity;
      }
      this.asteroid = user.asteroid;
    });

    this.initializeEmmiter();
  }

  asteroidClick() {
    // ga('asteroid.send', 'event', 'buttons', 'click', 'asteroid');
    this.clicked = true;
    const max = this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].maxRate;
    if (this.userS.currentUser.currentMineRate < max) {
      this.userS.modifyCurrentMineRate(this.userS.currentUser.currentMineRate + max * 0.1 > max ? max :
        this.userS.currentUser.currentMineRate + max * 0.1);
    }

    if (this.userS.currentUser.currentMineRate === max) {
      this.drone.activeLaser();
      this.asteroidSprite.checkAstero = true;
    }
  }

  resetClick() {
    const max = this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].maxRate;
    const base = this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].baseRate;

    if (!this.clicked) {
      if (this.userS.currentUser.currentMineRate > base) {
        this.userS.modifyCurrentMineRate(this.userS.currentUser.currentMineRate - (0.1 * max) <
          base ? base : this.userS.currentUser.currentMineRate - (0.1 * max));
      } else {
        this.userS.modifyCurrentMineRate(base);
        this.drone.desactivLaser();
        this.asteroidSprite.checkAstero = false;
      }
    } else {
      this.clicked = false;
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
}
