import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';
import { UserService } from '../../user/user.service';
import { AsteroidSprite } from './asteroidSprite';
import { Drone } from './drone';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';
import { ParticleBase } from '../../pixiVisual/particleBase';
import { AsteroidService } from '../asteroid.service';
import { SocketService } from '../../socket/socket.service';


@Component({
  selector: 'app-asteroid-view',
  templateUrl: './asteroid-view.component.html',
  styleUrls: ['./asteroid-view.component.scss']
})

export class AsteroidViewComponent implements AfterViewInit {
  constructor(private el: ElementRef, private render: Renderer2, private userS: UserService,
    private upgradeS: UpgradeService, private asteroidS: AsteroidService, private socketS: SocketService) { }

  private app: PIXI.Application;
  private aster: AsteroidSprite;
  private drone: Drone;
  private emitter: ParticleBase;
  clicked: boolean;

  ngAfterViewInit() {
    const w = this.el.nativeElement.parentElement.offsetWidth;
    const h = this.el.nativeElement.parentElement.offsetHeight;

    this.app = new PIXI.Application(w, h, { backgroundColor: 0x1079bb });
    this.render.appendChild(this.el.nativeElement, this.app.view);

    const background = PIXI.Sprite.fromImage('assets/Ciel.jpg');
    background.width = this.app.renderer.width;
    background.height = this.app.renderer.height;
    this.app.stage.addChild(background);

    this.aster = new AsteroidSprite(0.25, 0.25, this.app, this.asteroidS.asteroidTypes
      [this.userS.currentUser.numAsteroid].ore, this.asteroidS.asteroidTypes.length);

    for (let i = 0; i < this.aster.asteroid.length; i++) {
      this.aster.asteroid[i].on('click', (event) => {
        this.asteroidClick();
      });
    }

    this.drone = new Drone(0.20, 0.20, this.app);

    this.drone.laserFirstState = this.userS.currentUser.getOreAmountFromString(this.asteroidS.asteroidTypes
      [this.userS.currentUser.numAsteroid].ore) < this.upgradeS.storage[this.userS.currentUser.storageLvl].capacity;

    this.initializeEmmiter();
    setInterval(() => {
      /*if (this.drone.laser.visible) {
        this.emitter.emit = true;
        this.emitter.updateOwnerPos(this.aster.asteroid[0].x, this.aster.asteroid[0].y);
      }*/
      /*this.userS.IncrementUserOre(this.upgradeS.storage[this.userS.currentUser.storageLvl].capacity,
        this.asteroidS.asteroidTypes[this.userS.currentUser.numAsteroid].ore);*/
        this.socketS.incrementOre(this.asteroidS.asteroidTypes[this.userS.currentUser.numAsteroid].ore,
        parseFloat((this.userS.currentUser.currentMineRate *
         this.asteroidS.asteroidTypes[this.userS.currentUser.numAsteroid].mineRate/100).toFixed(2)));
    }, 1000);
    setInterval(() => { this.resetClick() }, 200);

    this.userS.userSubject.subscribe((user: User) => {
      this.aster.changeSprite(this.asteroidS.asteroidTypes[user.numAsteroid].ore);
      if (this.drone.laser != null) {
        this.drone.laser.visible = user.getOreAmountFromString(this.asteroidS.asteroidTypes[user.numAsteroid].ore) <
         this.upgradeS.storage[user.storageLvl].capacity;
     }
    });
  }

  @HostListener('window:resize') onResize() {
    const w = this.el.nativeElement.parentElement.offsetWidth;
    const h = this.el.nativeElement.parentElement.offsetHeight;
    this.app.renderer.resize(w, h);
  }

  asteroidClick() {
    // ga('asteroid.send', 'event', 'buttons', 'click', 'asteroid');
    this.clicked = true;
    const max = this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].maxRate;
    if (this.userS.currentUser.currentMineRate < max) {
      this.userS.currentUser.currentMineRate = this.userS.currentUser.currentMineRate + max * 0.1 > max ? max :
        this.userS.currentUser.currentMineRate + max * 0.1;
      // this.updateLaserSpeed();
    }
  }

  resetClick() {
    const max = this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].maxRate;
    const base = this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].baseRate;

    if (!this.clicked) {
      if (this.userS.currentUser.currentMineRate > base) {
        this.userS.currentUser.currentMineRate = this.userS.currentUser.currentMineRate - (0.1 * max) <
          base ? base : this.userS.currentUser.currentMineRate - (0.1 * max);
      } else {
        this.userS.currentUser.currentMineRate = base;
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
    this.emitter.updateOwnerPos(this.aster.asteroid[0].x, this.aster.asteroid[0].y);
  }
}
