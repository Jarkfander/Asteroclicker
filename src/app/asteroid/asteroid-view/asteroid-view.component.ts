import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import * as PIXI from 'pixi.js';
import { UserService } from '../../user/user.service';
import { Asteroid } from './asteroid';
import { Drone } from './drone';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';

@Component({
  selector: 'app-asteroid-view',
  templateUrl: './asteroid-view.component.html',
  styleUrls: ['./asteroid-view.component.scss']
})

export class AsteroidViewComponent implements AfterViewInit {
  constructor(private el: ElementRef, private render: Renderer2, private userS: UserService, private upgradeS: UpgradeService) { }

  private app: PIXI.Application;
  private aster: Asteroid;
  private drone: Drone;

  clicked: boolean;
  mineRate: number;

  ngAfterViewInit() {
    const w = this.el.nativeElement.parentElement.offsetWidth;
    const h = this.el.nativeElement.parentElement.offsetHeight;

    this.app = new PIXI.Application(w, h, { backgroundColor: 0x1079bb });
    this.render.appendChild(this.el.nativeElement, this.app.view);

    const background = PIXI.Sprite.fromImage('assets/Ciel.jpg');
    background.width = this.app.renderer.width;
    background.height = this.app.renderer.height;
    this.app.stage.addChild(background);

    this.aster = new Asteroid(0.25, 0.25, this.app);

    this.aster.asteroid.on('click', (event) => {
      this.asteroidClick();
    });

    this.drone = new Drone(0.25, 0.25, this.app);

    setInterval(() => {this.userS.IncrementUserCarbon(this.mineRate); }, 1000);
    setInterval(() => {this.resetClick()}, 200);
  }


  asteroidClick() {
    //ga('asteroid.send', 'event', 'buttons', 'click', 'asteroid');
    this.clicked = true;
    const max=this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].maxRate;
    
    if (this.mineRate < max) {
      this.mineRate = this.mineRate + max * 0.1 > max ?
      max : this.mineRate + max * 0.1;
      //this.updateLaserSpeed();
    }
  }

  resetClick() {
    console.log(this.userS.currentUser.mineRateLvl);
    const max=this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].maxRate;
    const base=this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].baseRate;

    if (!this.clicked) {
      if (this.mineRate > base) {
        this.mineRate = this.mineRate - (0.1 * max) < base ? base : this.mineRate - (0.1 * max);
      }
      else{
        this.mineRate=base;
      }
    }
    else {
      this.clicked = false;
    }

  }

}
