import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { Storage } from '../upgrade/storage';
import { MineRate } from '../upgrade/mineRate';
import { UpgradeService } from '../upgrade/upgrade.service';
import { MarketService } from '../market/market.service';
import { Quest } from '../topbar/quest';
import { AsteroidSearch } from '../asteroid/asteroidSearch';
import { Asteroid } from '../asteroid/asteroid';

@Injectable()
export class UserService {

  db: AngularFireDatabase;
  currentUser: User;
  userLoad: boolean = false;
  afAuth: AngularFireAuth;

  userSubject = new Subject<User>();

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth,
    private upgradeS: UpgradeService, private marketS: MarketService) {
    this.db = db;
    this.afAuth = afAuth;
    afAuth.authState.subscribe((auth) => {
      if (auth != null) {
        this.currentUser = new User();
        this.db.object('users/' + auth.uid).valueChanges().subscribe(
          (snapshot: any) => {
            this.FillUser(auth.uid, snapshot);
          });
      }
    });
  }

  public LogIn(log, pswd) {
    this.afAuth.auth.signInWithEmailAndPassword(log, pswd);
  }

  public LogOut() {
    this.userLoad = false;
    this.currentUser = null;
    this.afAuth.auth.signOut();
  }

  FillUser(uid, snapshot) {
    this.currentUser.uid = uid;

    this.currentUser.carbon = snapshot.ore.carbon;
    this.currentUser.titanium = snapshot.ore.titanium;

    this.currentUser.credit = snapshot.credit;
    this.currentUser.email = snapshot.profile.email;
    this.currentUser.name = snapshot.profile.name;

    this.currentUser.mineRateLvl = snapshot.upgrade.mineRateLvl;
    this.currentUser.storageLvl = snapshot.upgrade.storageLvl;
    this.currentUser.researchLvl = snapshot.upgrade.researchLvl;

    this.currentUser.asteroid = new Asteroid(snapshot.asteroid.currentCapacity, snapshot.asteroid.capacity, snapshot.asteroid.purity,
      snapshot.asteroid.ore, snapshot.asteroid.seed, 0);

    this.currentUser.score = snapshot.upgrade.score;

    this.currentUser.quest = new Quest(snapshot.quest.name, snapshot.quest.type, snapshot.quest.values,
      snapshot.quest.num, snapshot.quest.gain);
    this.currentUser.quest.text = snapshot.quest.text;
    this.currentUser.quest.valuesFinal = snapshot.quest.valuesFinal;

    let resultTab = new Array<Asteroid>();
    if (snapshot.search.result != 0) {
      for (let i = 0; i < snapshot.search.result.length; i++) {
        resultTab.push(new Asteroid(snapshot.search.result[i].capacity, snapshot.search.result[i].capacity, snapshot.search.result[i].purity,
          snapshot.search.result[i].ore, snapshot.search.result[i].seed, snapshot.search.result[i].timeToGo));
      }
    }
    this.currentUser.asteroidSearch = new AsteroidSearch(resultTab, snapshot.search.timer);
    this.userSubject.next(this.currentUser);
    this.userLoad = true;
  }
  searchNewAsteroid(num: number) {
    this.db.object('users/' + this.currentUser.uid + '/numAsteroid').set(num);
  }

}
