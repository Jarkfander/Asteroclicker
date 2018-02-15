import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import * as PIXI from 'pixi.js';

import { AsteroidSprite } from './asteroidSprite';
import { AsteroidPiece, STATE_PIECE } from './asteroidPiece';
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
  textPiecePatron: PIXI.Text;
  textPieces: PIXI.Text;
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
  private clickGauge = 0;

  // Asteroid piece
  asteroidPieceParent: AsteroidPiece;
  tempTabDeletePiece: Array<number>;

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
    private oreS: OreService) { }

  ngOnInit(): void {
    this.clicks = new Array();
    this.subjectManage();

    setInterval(() => {
      if (this.asteroid != null && this.asteroid.currentCapacity > 0 && this.asteroid.collectible < this.asteroid.currentCapacity) {
        const amounts = parseFloat((this.userS.currentUser.currentMineRate *
          this.asteroid.purity / 100 *
          this.resourcesS.oreInfos[this.asteroid.ore].miningSpeed).toFixed(2));
        this.socketS.breakIntoCollectible(amounts);

        this.socketS.updateClickGauge(this.numberOfClick);
        this.xLaser = -Math.cos(this.drone.drone.rotation - Math.PI / 2) * this.drone.laserAnim.height * this.drone.laserAnim.scale.y + this.drone.xBaseDrone;
        this.yLaser = -Math.sin(this.drone.drone.rotation - Math.PI / 2) * this.drone.laserAnim.height * this.drone.laserAnim.scale.y;
        this.generatePiece(this.asteroid.ore, amounts, this.xLaser, this.yLaser);
        this.numberOfClick = 0;
      }
    }, 1000);

    this.userS.getUpgradeByName('mineRate').subscribe((upgrade: IUserUpgrade) => {
      this.userMineRateLvl = upgrade.lvl;
      this.initNumberOfDroneBegin();
    });
    setInterval(() => { this.updateClick(); }, 100);
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
    this.app.stage.removeChildren();
    this.render.removeChild(this.el.nativeElement, this.app.view);
    delete this.asteroidSprite;
    this.app.destroy();

    this.app = new PIXI.Application(this.el.nativeElement.offsetWidth, this.el.nativeElement.offsetHeight, { backgroundColor: 0x1079bb });
    this.render.appendChild(this.el.nativeElement, this.app.view);

    this.initAsteroid(this.asteroid);
    delete this.drone;
    this.initNumberOfDroneBegin();
    this.drone.statsActu = STATS_DRONE.MINING;
  }

  private initAsteroid(newAste: IAsteroid) {
    const w = this.el.nativeElement.offsetWidth;
    const h = this.el.nativeElement.offsetHeight;
    this.delta = 0;
    // skyV1
    this.initSky(w, h);
    this.textPieces = new PIXI.Text(' ',
      {
        fontFamily: 'Montserrat-Black',
        fontSize: 20, fill: 0x000FF00,
        align: 'center'
      });

    this.textPieces.x = this.app.stage.width / 3 - 200;
    this.textPieces.y = this.app.stage.height;

    this.app.stage.addChild(this.textPieces);


    this.asteroidSprite = new AsteroidSprite(w, h, this.app, newAste);

    this.asteroidSprite.asteroid[0].on('click', (event) => {
      this.asteroidClick();
    });
    this.asteroidPieceParent = new AsteroidPiece(PIXI.Texture.fromImage('assets/AsteroidParticle/parentPiece.png'), 0.5, 0, 0, 0, 'carbon');
    this.tempTabDeletePiece = new Array<number>();
    this.app.stage.addChild(this.asteroidPieceParent);

    this.tickerApp();

    this.asteroidSprite.eventOk = this.userS.currentUser.event;
    this.asteroidSprite.activEvent();
    this.clickCapsule();

    this.initializeEmmiter();
  }

  // Subject
  subjectManage() {
    const w = this.el.nativeElement.offsetWidth;
    const h = this.el.nativeElement.offsetHeight;
    this.app = new PIXI.Application(w, h, { backgroundColor: 0x1079bb });
    this.render.appendChild(this.el.nativeElement, this.app.view);
    this.initNumberOfDroneBegin();
    this.xLaser = -Math.cos(this.drone.drone.rotation - Math.PI / 2) * this.drone.laserAnim.height * this.drone.laserAnim.scale.y + this.drone.xBaseDrone;
    this.yLaser = -Math.sin(this.drone.drone.rotation - Math.PI / 2) * this.drone.laserAnim.height * this.drone.laserAnim.scale.y;
    this.asteroidS.asteroid$.take(1).subscribe((asteroid: IAsteroid) => {

      this.initAsteroid(asteroid);
      this.asteroid = asteroid;
      this.initPieceOfDrone();

      this.userS.miningInfo.subscribe((info: IMiningInfo) => {
        const amounts = parseFloat((this.userS.currentUser.currentMineRate *
          this.asteroid.purity / 100 *
          this.resourcesS.oreInfos[this.asteroid.ore].miningSpeed).toFixed(2));

        if (this.clickGauge > info.clickGauge) {
          console.log(this.clickGauge + "  " + info.clickGauge);
          for (let i = 0; i < 5; i++) {
            this.generatePiece(this.asteroid.ore, amounts, this.xLaser, this.yLaser);
          }
        }
        this.clickGauge = info.clickGauge;
      });
      // Asteroid Subject
      this.asteroidS.asteroid$.subscribe((asteroid: IAsteroid) => {
        this.drone.isMining = false;

        const state = this.asteroidSprite.computeState(asteroid);

        if (this.asteroidSprite.state != -1 && state == -1) {
          this.asteroidSprite.destructBase();
        }

        if (state < this.asteroidSprite.state && state != -1) {
          this.asteroidSprite.destructOnePart();
        }

        if (asteroid.currentCapacity > this.asteroid.currentCapacity) {
          this.asteroidSprite.changeSprite(asteroid);
          this.drone.laserAnim.visible = true;
        }
        this.asteroid = asteroid;
        this.drone.droneMiningVerif();

      });

      // Asteroid is empty
      this.asteroidS.isEmpty.subscribe((isEmpty: boolean) => {
        this.drone.setIsAsteLifeSupZero(!isEmpty);
      });

      // Event Subject
      this.userS.eventSubject.subscribe((user: User) => {
        if (this.asteroidSprite) {
          this.asteroidSprite.eventOk = user.event;
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
      // frenzy Subject
      this.userS.frenzyInfo.subscribe((frenzy: IFrenzyInfo) => {
        this.frenzyInfo = frenzy;
        this.frenzyModGoOrNot(frenzy);
      });
      // Profile Subject
      this.userS.profile.subscribe((profile: IProfile) => {
        profile.badConfig ? this.backgroundSky.stop() : this.backgroundSky.play();
      });

      // Upgrade Subject
      this.userS.getUpgradeByName('mineRate').subscribe((upgrade: IUserUpgrade) => {
        const tempLvl = upgrade.lvl;
        this.drone.changeSpriteDrone(upgrade.lvl);
      });

      // upgrade Storage
      this.userS.getUpgradeByName('storage')
        .subscribe((userUpgrade) => {
          this.storageCapacityMax = this.resourcesS[userUpgrade.name][userUpgrade.lvl].capacity;
        });

      // User ore amounts
      this.oreS.OreAmounts
        .subscribe((oreAmount: IOreAmounts) => {
          this.drone.setIsUserHaveMaxCapacityStorage(this.asteroid && oreAmount[this.asteroid.ore] >= this.storageCapacityMax);
        });

    });
  }

  asteroidClick() {
    // ga('asteroid.send', 'event', 'buttons', 'click', 'asteroid');
    if (!this.userS.currentUser.frenzy.state) {
      this.numberOfClick++;
      this.clicks.push(Date.now());
    }
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
    this.userS.modifyCurrentMineRate(newRate <= max ? newRate : max);

    if (this.coefClick >= 1) {
      //this.socketS.reachFrenzy();
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
    this.backgroundSky = initSprite('ciel3_1', 500, 500, true, this.userS.currentUser.boolBadConfig, 0.32);
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
      this.userS.currentUser.frenzy.comboInd = 0;
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
      this.socketS.validArrow(numTouchUserActu - 37, this.userS.currentUser.frenzy.comboInd);
      if (this.frenzyInfo.nextCombos[this.userS.currentUser.frenzy.comboInd] === (numTouchUserActu - 37)) {
        this.userS.currentUser.frenzy.comboInd++;
        this.asteroidSprite.frenzyModTouch(this.frenzyInfo.nextCombos[this.userS.currentUser.frenzy.comboInd]);
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
  * Managed asteroid piece
  */

  // Piece of aste
  generatePiece(oreName: string, values, _x: number, _y: number) {

    if (this.asteroidPieceParent.children.length >= 100) {
      this.socketS.pickUpCollectible(oreName, values);
      this.addTextToPiecetext(values, '0xFFA500');
      return;
    }
    const randomX = Math.random() * (this.app.renderer.width - 150) + 80;
    const randomY = Math.random() * (this.app.renderer.height - 150) + 80;

    const sprite = new AsteroidPiece(PIXI.Texture.fromImage('assets/AsteroidParticle/' + oreName + 'Particle.png'), Math.random() * 2, randomX, randomY, values, oreName);
    sprite.texture.baseTexture.mipmap = true;
    sprite.anchor.set(0.5);

    sprite.x = _x;
    sprite.y = _y;

    const randomScale = Math.random() + 0.5;
    sprite.scale.set(0.25 * randomScale, 0.25 * randomScale);
    sprite.rotation = Math.random() * 180;
    const circle = new PIXI.Graphics();
    circle.beginFill(0x0000FF, 0);
    circle.drawCircle(150, 150, 200 * (1 - sprite.scale.x));
    circle.endFill();
    circle.alpha = 0.5;
    circle.x -= (sprite.width) + 150;
    circle.y -= (sprite.height) + 150;
    sprite.addChild(circle);

    circle.interactive = true;

    this.asteroidPieceParent.addChild(sprite);
    circle.on('mouseover', (event) => {
      sprite.state = STATE_PIECE.GO;
    });
  }

  // detroy
  detroyPiece(values, orename, i) {
    this.tempTabDeletePiece.push(i);
    this.socketS.pickUpCollectible(orename, values);
  }

  initPieceOfDrone() {
    if (this.asteroid.collectible > 0) {
      const amounts = parseFloat((this.userS.currentUser.currentMineRate *
        this.asteroid.purity / 100 *
        this.resourcesS.oreInfos[this.asteroid.ore].miningSpeed).toFixed(2));

      for (let i = 0; i < this.asteroid.collectible / amounts; i++) {
        this.generatePiece(this.asteroid.ore, amounts, this.xLaser, this.yLaser);
      }
    }
  }

  lerpVector2(sourceX, sourceY, destX, destY, delta, isRotate = false) {
    const vect = new Vector2(); const vectorTemp = new Vector2();
    vectorTemp.initXY(sourceX, sourceY);
    vect.initXYVector(vectorTemp.lerp(destX, destY, delta));
    return vect;
  }

  /*
  *  App Ticker Delta
  */
  tickerApp() {
    this.app.ticker.add((delta) => {
      if (this.delta > 2 * Math.PI) {
        this.delta = 0;
      }
      this.delta += (2 * Math.PI) / 1000;
      this.textAlphaDecrease();
      let pieceAster = this.asteroidPieceParent.children[0];
      let pieceAsterCast = (this.asteroidPieceParent.children[0] as AsteroidPiece);
      for (let i = 0; i < this.asteroidPieceParent.children.length; i++) {

        pieceAster = this.asteroidPieceParent.children[i];
        pieceAsterCast = (this.asteroidPieceParent.children[i] as AsteroidPiece);

        switch (pieceAsterCast.state) {
          case STATE_PIECE.GO:
            if (pieceAster.y >= this.app.renderer.height) {
              this.detroyPiece(pieceAsterCast.values, pieceAsterCast.type, i);
              this.addTextToPiecetext(pieceAsterCast.values, '0x00FF00');
            } else {
              const vectGO = this.lerpVector2(pieceAster.x, pieceAster.y, this.app.renderer.width / 4, this.app.renderer.height + 50, 0.08);
              pieceAster.x = vectGO.x;
              pieceAster.y = vectGO.y;
            }
            break;

          case STATE_PIECE.STAY:
            pieceAster.x = pieceAsterCast.basePosX + Math.cos(this.delta) * -2.40 * (3 + pieceAsterCast.moveSpace);
            pieceAster.y = pieceAsterCast.basePosY + Math.sin(this.delta) * -2.05 * (3 + pieceAsterCast.moveSpace);
            break;

          case STATE_PIECE.SPAWN:
            const vectSPAWN = this.lerpVector2(pieceAster.x, pieceAster.y, pieceAsterCast.basePosX, pieceAsterCast.basePosY, 0.1);
            pieceAster.x = vectSPAWN.x;
            pieceAster.y = vectSPAWN.y;
            /*
            if (Math.abs(pieceAster.x - pieceAsterCast.basePosX) < 0.001 && Math.abs(pieceAster.y - pieceAsterCast.basePosY) < 0.001) {
              pieceAsterCast.state = STATE_PIECE.STAY;
            }*/
            break;

        }

      }

      for (let j = 0; j < this.tempTabDeletePiece.length; j++) {
        this.asteroidPieceParent.children.splice(this.tempTabDeletePiece[j], 1);
        this.textPieces.children.splice(this.tempTabDeletePiece[j], 1);
      }
      this.tempTabDeletePiece.splice(0, this.tempTabDeletePiece.length);
      this.asteroidSprite.tickerAppAsteroid();
    });
  }


  /*
  * MANAGED Text
  */
  textAlphaDecrease() {
    const tempErase = new Array<number>();
    for (let i = 0; i < this.textPieces.children.length; i++) {
      if (this.textPieces.children[i].alpha < 0) {
        tempErase.push(i);
        continue;
      }
      this.textPieces.children[i].y -= 1.8;
      this.textPieces.children[i].alpha -= 0.01;
    }
    for (let i = 0; i < tempErase.length; i++) {
      this.textPieces.children.splice(tempErase[i], 1);
    }
  }

  textAlphaToOne(i: number) {
    for (let i = 0; i < this.textPieces.children.length; i++) {
      this.textPieces.children[i].alpha = 1;
    }
  }

  addTextToPiecetext(values, color) {
    const textTemp = new PIXI.Text('+' + values,
      {
        fontFamily: 'Montserrat-Black',
        fontSize: 20, fill: color,
        align: 'center'
      });
    textTemp.alpha = 1;
    textTemp.x += Math.random() * 250;
    this.textPieces.addChild(textTemp);
  }
}
