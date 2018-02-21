import { Injectable } from '@angular/core';
import { User, UserUpgrade, Chest } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { MarketService } from '../../market/market.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { SocketService } from '../socket/socket.service';
import { Frenzy } from './frenzy';
import { Quest } from '../../quest/quest';
import { IAsteroid } from '../../asteroid/asteroid.service';
import { Observable } from 'rxjs/Observable';
import { Research } from '../../ship/upgrade-class/research';
import { storage } from 'firebase';


export interface IFrenzyInfo {
  nextCombos;
  state: number;
}

export interface IProfile {
  badConfig: number;
  email: string;
  name: string;
}


export interface IUserUpgrade {
  name: string;
  lvl: number;
  start: number;
  timer: number;
}

export interface IMiningInfo {
  clickGauge: number;
}

export interface IChest { // maper 0,1,2 sur reward 1 etc ...
  0,
  1,
  2,
}


export interface IQuest {
  gain: number,
  name: string,
  num: number,
  test: string,
  type: string,
  values: number,
  valuesFinal: number
}


@Injectable()
export class UserService {

  public localClickGauge = 0;

  public localFrenzyInd = 0;

  public userId: string;
  afAuth: AngularFireAuth;

  localClickGaugeSubject = new Subject<number>();

  //cargoSubject = new Subject<User>();

  constructor(private db: AngularFireDatabase, private marketS: MarketService) { }

  initializeUser(id: string) {
    this.userId = id;

    /* this.db.object('users/' + id + '/cargo').valueChanges().subscribe(
       (snapshot: any) => {
         this.FillCargo(snapshot);
       });*/
  }

  get quest(): Observable<IQuest> {
    return this.db.object('users/' + this.userId + '/quest').valueChanges<IQuest>();
  }

  get event(): Observable<number> {
    return this.db.object('users/' + this.userId + '/event').valueChanges<number>();
  }

  get score(): Observable<number> {
    return this.db.object('users/' + this.userId + '/score').valueChanges<number>();
  }

  get chest(): Observable<IChest[]> {
    return this.db.object('users/' + this.userId + '/chest').valueChanges()
      .map((allChests: any) => {
        let chests: IChest[] = new Array();
        for (let i = 0; i < allChests.numberOfChest; i++) {
          chests.push(allChests["chest" + i]);
        }
        return chests;
      });
  }

  get credit(): Observable<number> {
    return this.db.object('users/' + this.userId + '/credit').valueChanges<number>();
  }

  get frenzyInfo(): Observable<IFrenzyInfo> {
    return this.db.object('users/' + this.userId + '/frenzy/info').valueChanges<IFrenzyInfo>();
  }

  get frenzyTimer(): Observable<number> {
    return this.db.object('users/' + this.userId + '/frenzy/time/timer').valueChanges<number>();
  }

  get miningInfo(): Observable<IMiningInfo> {
    return this.db.object('users/' + this.userId + '/miningInfo').valueChanges<IMiningInfo>();
  }

  get profile(): Observable<IProfile> {
    return this.db.object('users/' + this.userId + '/profile').valueChanges<IProfile>();
  }

  get upgrade(): Observable<IUserUpgrade[]> {
    return this.db.object('users/' + this.userId + '/upgrade').valueChanges<IUserUpgrade[]>()
      .map((upgrades: IUserUpgrade[]) => {
        const allCurrentUpgrade: IUserUpgrade[] = new Array();
        for (const key in upgrades) {
          if (key in upgrades && key !== 'QG') {
            const currentUpgrade = upgrades[key];
            currentUpgrade['name'] = key;
            allCurrentUpgrade.push(currentUpgrade);
          }
        }
        return allCurrentUpgrade;
      });
  }

  getUpgradeByName(upgradeName: string): Observable<IUserUpgrade> {
    return this.db.object('users/' + this.userId + '/upgrade/' + upgradeName).valueChanges<IUserUpgrade>()
      .map((upgrade: IUserUpgrade) => {
        return { ...upgrade, name: upgradeName };
      });
  }

  /*FillCargo(snapshot) {
    this.currentUser.cargo = snapshot;
    this.cargoSubject.next(this.currentUser);
  }*/

}
