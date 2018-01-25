import { Injectable } from '@angular/core';
import { User, UserUpgrade, Chest } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { MarketService } from '../../market/market.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { SocketService } from '../socket/socket.service';
import { Frenzy } from './frenzy';
import { UpgradeService } from '../../ship/upgrade.service';
import { Quest } from '../../quest/quest';
import { IAsteroid } from '../../asteroid/asteroid.service';
import { AuthService } from '../../signin/auth.service';
import { Observable } from 'rxjs/Observable';
import { Research } from '../../ship/upgrade-class/research';
import { storage } from 'firebase';



export interface IUser {

  uid: string;
  credit: number;

  email: string;
  name: string;

  currentMineRate: number;

  score: number;

  quest: Quest;
  chest: Array<Chest>;
  numberOfChest: number;

  upgrades: UserUpgrade[];

  event: number;

  frenzy: Frenzy;

  boolBadConfig: boolean;
}

export interface IFrenzyInfo {
  nextCombos,
  state: number
}

export interface IProfile {
  badConfig: number,
  email: string,
  name: string
}


export interface IUserUpgrade {
  name: string,
  lvl: number,
  start: number,
  timer: number,
}

@Injectable()
export class UserService {

  loadedTrigger: number = 3;
  loadedCounter: number = 0;

  db: AngularFireDatabase;
  currentUser: User;
  userLoad: boolean = false;
  afAuth: AngularFireAuth;

  chestSubject = new Subject<User>();

  questSubject = new Subject<User>();
  searchSubject = new Subject<User>();

  mineRateSubject = new Subject<User>();
  eventSubject = new Subject<User>();



  cargoSubject = new Subject<User>();

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth,
    private upgradeS: UpgradeService, private marketS: MarketService,
    private socketS: SocketService, private authS: AuthService) {

    this.db = db;
    this.afAuth = afAuth;
    afAuth.authState.subscribe((auth) => {
      if (auth != null) {
        this.currentUser = new User();
        this.currentUser.frenzy = new Frenzy(false, 0, {});
        this.currentUser.uid = auth.uid;
        this.db.object('users/' + auth.uid + '/chest').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillChest(snapshot);
          });
        this.db.object('users/' + auth.uid + '/quest').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillQuest(snapshot);
          });
        this.db.object('users/' + auth.uid + '/event').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillEvent(snapshot);
          });

        this.db.object('users/' + auth.uid + '/cargo').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillCargo(snapshot);
          });
      }
    });
  }

  get credit(): Observable<number> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/credit').valueChanges<number>());
  }

  get frenzyInfo(): Observable<IFrenzyInfo> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/frenzy/info').valueChanges<IFrenzyInfo>());
  }

  get frenzyTimer(): Observable<number> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/frenzy/time/timer').valueChanges<number>());
  }

  get profile(): Observable<IProfile> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/profile').valueChanges<IProfile>());
  }

  get upgrade(): Observable<IUserUpgrade[]> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/upgrade').valueChanges())
      .map((upgrades) => {
        const allCurrentUpgrade: IUserUpgrade[] = new Array();
        for (const key in upgrades) {
          if (key in upgrades) {
            const currentUpgrade = upgrades[key];
            currentUpgrade['name'] = key;
            allCurrentUpgrade.push(currentUpgrade);
          }
        }
        return allCurrentUpgrade;
      });
  }

  getUpgradeByName(upgradeName: string): Observable<IUserUpgrade> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/upgrade/' + upgradeName).valueChanges())
      .map((upgrade) => {
        upgrade['name'] = upgradeName;
        return <IUserUpgrade>upgrade;
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
