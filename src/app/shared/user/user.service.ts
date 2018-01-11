import { Injectable } from '@angular/core';
import { User, UserUpgrade, Chest } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { UpgradeService } from '../../ship/upgrade-list/upgrade.service';
import { MarketService } from '../../market/market.service';
import { Asteroid } from '../../asteroid/asteroid-view/asteroid';
import { Quest } from '../../market/topbar/quest';
import { SearchResult } from '../../asteroid/search-result/searchResult';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { SocketService } from '../socket/socket.service';
import { Frenzy } from './frenzy';


@Injectable()
export class UserService {

  loadedTrigger: number = 7;
  loadedCounter: number = 0;

  db: AngularFireDatabase;
  currentUser: User;
  userLoad: boolean = false;
  afAuth: AngularFireAuth;

  asteroidSubject = new Subject<User>();
  chestSubject = new Subject<User>();
  creditSubject = new Subject<User>();
  oreSubject = new Subject<User>();
  profileSubject = new Subject<User>();
  questSubject = new Subject<User>();
  searchSubject = new Subject<User>();
  upgradeSubject = new Subject<User>();
  mineRateSubject = new Subject<User>();
  eventSubject = new Subject<User>();
  frenzySubjectCombo = new Subject<number>();
  frenzySubjectState = new Subject<Frenzy>();

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth,
    private upgradeS: UpgradeService, private marketS: MarketService, private socketS: SocketService) {

    this.db = db;
    this.afAuth = afAuth;
    afAuth.authState.subscribe((auth) => {
      if (auth != null) {
        this.currentUser = new User();
        this.currentUser.frenzy=new Frenzy(false,0,{});
        this.currentUser.uid = auth.uid;
        this.db.object('users/' + auth.uid + '/asteroid').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillAsteroid(snapshot);
          });
        this.db.object('users/' + auth.uid + '/chest').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillChest(snapshot);
          });
        this.db.object('users/' + auth.uid + '/credit').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillCredit(snapshot);
          });
        this.db.object('users/' + auth.uid + '/ore').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillOre(snapshot);
          });
        this.db.object('users/' + auth.uid + '/profile').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillProfile(snapshot);
          });
        this.db.object('users/' + auth.uid + '/quest').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillQuest(snapshot);
          });
        this.db.object('users/' + auth.uid + '/search').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillSearch(snapshot);
          });
        this.db.object('users/' + auth.uid + '/upgrade').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillUpgrade(snapshot);
          });
        this.db.object('users/' + auth.uid + '/event').valueChanges().subscribe(
          (snapshot: any) => {
            this.FillEvent(snapshot);
          });
        this.db.object('users/' + auth.uid + '/frenzy/info').valueChanges().subscribe(
          (info: any) => {
            this.db.object('users/' + auth.uid + '/frenzy/time').valueChanges().take(1).subscribe(
              (time: any) => {
                this.FillFrenzy(info,time);
                this.frenzySubjectState.next(this.currentUser.frenzy);
              });
          });
        this.db.object('users/' + auth.uid + '/frenzy/time').valueChanges().subscribe(
          (snapshot: any) => {
            if(this.currentUser.frenzy!=null){
              this.currentUser.frenzy.updateTimer(snapshot.timer);
            }
          });
      }
    });
  }

  public LogIn(log, pswd) {
    this.afAuth.auth.signInWithEmailAndPassword(log, pswd);
  }

  public CreateAccount(email, pswd) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, pswd).then((message) => {
      this.socketS.initializeUser(message.uid, email);
    });
  }

  public LogOut() {
    this.userLoad = false;
    this.currentUser = null;
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }

  FillAsteroid(snapshot) {
    this.currentUser.asteroid = new Asteroid(snapshot.currentCapacity, snapshot.capacity, snapshot.purity,
      snapshot.ore, snapshot.seed, 0);
    this.asteroidSubject.next(this.currentUser);
    this.incrementCounter();
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

  FillCredit(snapshot) {
    this.currentUser.credit = snapshot;
    this.creditSubject.next(this.currentUser);
    this.incrementCounter();
  }

  FillOre(snapshot) {
    this.currentUser.oreAmounts = snapshot;
    this.oreSubject.next(this.currentUser);
    this.incrementCounter();
  }

  FillProfile(snapshot) {
    this.currentUser.email = snapshot.email;
    this.currentUser.name = snapshot.name;
    this.currentUser.boolBadConfig = snapshot.badConfig === 0 ? false : true;
    this.profileSubject.next(this.currentUser);
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

  FillSearch(snapshot) {
    const resultTab = new Array<Asteroid>();
    if (snapshot.result != 0) {
      for (let i = 0; i < snapshot.result.length; i++) {
        resultTab.push(new Asteroid(snapshot.result[i].capacity, snapshot.result[i].capacity, snapshot.result[i].purity,
          snapshot.result[i].ore, snapshot.result[i].seed, snapshot.result[i].timeToGo));
      }
    }
    this.currentUser.asteroidSearch = new SearchResult(resultTab, snapshot.timer, snapshot.start);
    this.searchSubject.next(this.currentUser);
    this.incrementCounter();
  }

  FillEvent(snapshot) {
    this.currentUser.event = snapshot;
    this.eventSubject.next(this.currentUser);
  }

  FillUpgrade(snapshot) {

    this.currentUser.upgrades[UpgradeType.storage] = new UserUpgrade(
      snapshot.storage.lvl,
      snapshot.storage.timer,
      snapshot.storage.start
    );

    this.currentUser.upgrades[UpgradeType.mineRate] = new UserUpgrade(
      snapshot.mineRate.lvl,
      snapshot.mineRate.timer,
      snapshot.mineRate.start
    );
    this.currentUser.upgrades[UpgradeType.research] = new UserUpgrade(
      snapshot.research.lvl,
      snapshot.research.timer,
      snapshot.research.start
    );

    this.currentUser.upgrades[UpgradeType.engine] = new UserUpgrade(
      snapshot.engine.lvl,
      snapshot.engine.timer,
      snapshot.engine.start
    );

    this.currentUser.score = snapshot.score;

    this.upgradeSubject.next(this.currentUser);
    this.incrementCounter();
  }

  FillFrenzy(info,time) {
    this.currentUser.frenzy = new Frenzy(info.state === 1,time.timer, info.nextCombos);
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
