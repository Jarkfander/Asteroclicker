import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { Storage } from '../upgrade/storage';
import { MineRate } from '../upgrade/mineRate';

@Injectable()
export class UserService {

  db: AngularFireDatabase;
  currentUser: User;
  userLoad: boolean = false;
  afAuth: AngularFireAuth;

  userSubject = new Subject<User>();

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {
    this.db = db;
    this.afAuth = afAuth;
    afAuth.authState.subscribe((auth) => {
      if (auth != null) {
        this.currentUser = new User();
        this.db.object("users/" + auth.uid).snapshotChanges().subscribe(
          (snapshot: any) => {
            this.FillUser(auth.uid, snapshot.payload.val());
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
    this.currentUser.credit = snapshot.credit;
    this.currentUser.email = snapshot.email;

    this.currentUser.mineRateLvl = snapshot.mineRateLvl;
    this.currentUser.storageLvl = snapshot.storageLvl;

    this.userSubject.next(this.currentUser);
    this.userLoad = true;
  }

  public IncrementUserCarbon(maxStorage: number) {
    const carbonValue: number = this.currentUser.carbon + this.currentUser.currentMineRate;
    if (carbonValue < maxStorage) {
      this.db.object('users/' + this.currentUser.uid + '/carbon').set(carbonValue);
    }
    else {
      if (this.currentUser.carbon != maxStorage) {
        this.db.object('users/' + this.currentUser.uid + '/carbon').set(maxStorage);
      }
    }
  }

  public SellCarbon(amount: number) {
    const carbonValue = 1;
    if (this.currentUser.carbon - amount >= 0) {
      this.db.object('users/' + this.currentUser.uid).update(
        {
          carbon: this.currentUser.carbon - amount,
          credit: this.currentUser.credit + carbonValue
        }
      );
    }
  }

  public stockLvlUp(creditDown: number) {
    const levelStock: number = this.currentUser.storageLvl + 1;
    const creditAfter: number = this.currentUser.credit - creditDown;
    this.db.object('users/' + this.currentUser.uid + '/storageLvl').set(levelStock);
    this.db.object('users/' + this.currentUser.uid + '/credit').set(creditAfter);
  }

  public mineRateLvlUp(creditDown: number) {
    const mineRate: number = this.currentUser.mineRateLvl + 1;
    const creditAfter: number = this.currentUser.credit - creditDown;
    this.db.object('users/' + this.currentUser.uid + '/mineRateLvl').set(mineRate);
    this.db.object('users/' + this.currentUser.uid + '/credit').set(creditAfter);
  }

}
