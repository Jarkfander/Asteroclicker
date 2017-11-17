import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { Storage } from '../upgrade/storage';
import { MineRate } from '../upgrade/mineRate';
import { UpgradeService } from '../upgrade/upgrade.service';
import { MarketService } from '../market/market.service';
import { AsteroidService } from '../asteroid/asteroid.service';
import { Quest } from '../topbar/quest';

@Injectable()
export class UserService {

  db: AngularFireDatabase;
  currentUser: User;
  userLoad: boolean = false;
  afAuth: AngularFireAuth;

  userSubject = new Subject<User>();

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth,
    private upgradeS: UpgradeService, private marketS: MarketService, private asteroidS: AsteroidService) {
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

    this.currentUser.carbon = snapshot.carbon;
    this.currentUser.titanium = snapshot.titanium;

    this.currentUser.credit = snapshot.credit;
    this.currentUser.email = snapshot.email;

    this.currentUser.mineRateLvl = snapshot.mineRateLvl;
    this.currentUser.storageLvl = snapshot.storageLvl;

    this.currentUser.numAsteroid = snapshot.asteroid.numAsteroid;
    this.currentUser.seedAsteroid = snapshot.asteroid.seed;

    this.currentUser.quest = new Quest(snapshot.quest.name, snapshot.quest.type, snapshot.quest.values,
      snapshot.quest.num, snapshot.quest.gain);

    this.userSubject.next(this.currentUser);
    this.userLoad = true;
  }
  searchNewAsteroid(num: number) {
    this.db.object('users/' + this.currentUser.uid + '/numAsteroid').set(num);
  }

}
