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



export interface IUser {

  uid: string;
  credit: number;

  email: string;
  name: string;

  currentMineRate: number;

  quest: Quest;
  chest: Array<Chest>;
  numberOfChest: number;

  upgrades: UserUpgrade[];

  event: number;

  frenzy: Frenzy;

  boolBadConfig: boolean;
}

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

@Injectable()
export class UserService {

  loadedTrigger = 3;
  loadedCounter = 0;

  db: AngularFireDatabase;
  currentUser: User;
  userLoad = false;
  afAuth: AngularFireAuth;

  chestSubject = new Subject<User>();

  questSubject = new Subject<User>();
  searchSubject = new Subject<User>();

  mineRateSubject = new Subject<User>();
  eventSubject = new Subject<User>();

  cargoSubject = new Subject<User>();

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth, private marketS: MarketService) {

    this.db = db;
    this.afAuth = afAuth;

  }

  initializeUser(id: string) {
    this.currentUser = new User();
    this.currentUser.frenzy = new Frenzy(false, 0, {});
    this.currentUser.uid = id;
    this.db.object('users/' + id + '/chest').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillChest(snapshot);
      });
    this.db.object('users/' + id + '/quest').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillQuest(snapshot);
      });
    this.db.object('users/' + id + '/event').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillEvent(snapshot);
      });

    this.db.object('users/' + id + '/cargo').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillCargo(snapshot);
      });
  }

  get credit(): Observable<number> {
    return this.db.object('users/' + this.currentUser.uid + '/credit').valueChanges<number>();
  }

  get frenzyInfo(): Observable<IFrenzyInfo> {
    return this.db.object('users/' + this.currentUser.uid + '/frenzy/info').valueChanges<IFrenzyInfo>();
  }

  get frenzyTimer(): Observable<number> {
    return this.db.object('users/' + this.currentUser.uid + '/frenzy/time/timer').valueChanges<number>();
  }

  get profile(): Observable<IProfile> {
    return this.db.object('users/' + this.currentUser.uid + '/profile').valueChanges<IProfile>();
  }

  get upgrade(): Observable<IUserUpgrade[]> {
    return this.db.object('users/' + this.currentUser.uid + '/upgrade').valueChanges<IUserUpgrade>()
      .map((upgrades) => {
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
    return this.db.object('users/' + this.currentUser.uid + '/upgrade/' + upgradeName).valueChanges<IUserUpgrade>()
      .map((upgrade: IUserUpgrade) => {
        upgrade.name = upgradeName;
        return upgrade;
      });
  }

  FillChest(snapshot) {
    this.currentUser.numberOfChest = snapshot.numberOfChest;
    this.currentUser.destroyChest();
    delete this.currentUser.chest;
    this.currentUser.chest = new Array<Chest>();
    for (let i = 0; i < snapshot.numberOfChest; i++) {
      const tempString = 'chest' + i;
      this.currentUser.chest.push(new Chest(snapshot[tempString][0], snapshot[tempString][1], snapshot[tempString][2]));
    }
    this.chestSubject.next(this.currentUser);
    this.incrementCounter();
  }


  FillQuest(snapshot) {
    this.currentUser.quest = new Quest(snapshot.name, snapshot.type, snapshot.values,
      snapshot.num, snapshot.gain);
    this.currentUser.quest.text = snapshot.text;
    this.currentUser.quest.valuesFinal = snapshot.valuesFinal;
    this.questSubject.next(this.currentUser);
    this.incrementCounter();
  }

  FillEvent(snapshot) {
    this.currentUser.event = snapshot;
    this.eventSubject.next(this.currentUser);
  }

  FillCargo(snapshot) {
    this.currentUser.cargo = snapshot;
    this.cargoSubject.next(this.currentUser);
  }

  incrementCounter() {
    if (!this.userLoad && this.loadedCounter < this.loadedTrigger) {
      this.loadedCounter++;
      if (this.loadedCounter === this.loadedTrigger) {
        this.userLoad = true;
      }
    }
  }

  modifyCurrentMineRate(value: number) {
    this.currentUser.currentMineRate = value;
    this.mineRateSubject.next(this.currentUser);
  }
}
