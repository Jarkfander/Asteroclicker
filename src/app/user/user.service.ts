import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { Storage } from '../upgrade/storage';
import { MineRate } from '../upgrade/mineRate';
import { UpgradeService } from '../upgrade/upgrade.service';
import { MarketService } from '../market/market.service';

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
        this.db.object("users/" + auth.uid).valueChanges().subscribe(
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

    this.currentUser.numAsteroid = snapshot.numAsteroid;

    this.userSubject.next(this.currentUser);
    this.userLoad = true;
  }

  public IncrementUserOre(maxStorage: number, ore: number, orename: string) {
    const oreValue: number = ore + this.currentUser.currentMineRate;
    if (oreValue < maxStorage) {
      this.db.object('users/' + this.currentUser.uid + '/' + orename).set(oreValue);
    } else {
      if (ore !== maxStorage) {
        this.db.object('users/' + this.currentUser.uid + '/' + orename).set(maxStorage);
      }
    }
  }

  public SellOre/*moon*/(amount: number, oreName: string) {
    const oreValue = Math.trunc(this.marketS.currentOresCosts.getCostsFromString(oreName)[Object.keys(this.marketS.currentOresCosts.getCostsFromString(oreName))[59]]
      * amount);
    if (this.currentUser.getOreAmountFromString(oreName) - amount >= 0) {
      var jsonUpdate={};
      jsonUpdate[oreName]=this.currentUser.getOreAmountFromString(oreName)  - amount;
      jsonUpdate["credit"]=this.currentUser.credit + oreValue;

      this.db.object('users/' + this.currentUser.uid).update(
        jsonUpdate
      );
    }
  }

  public BuyOre(amount: number,oreName: string) {
    const costFinal = Math.trunc(amount *
      this.marketS.currentOresCosts.getCostsFromString(oreName)[Object.keys(this.marketS.currentOresCosts.getCostsFromString(oreName))[59]]);
    if (this.currentUser.credit - costFinal >= 0 &&
      this.currentUser.getOreAmountFromString(oreName) + amount < this.upgradeS.storage[this.currentUser.storageLvl].capacity) {
        var jsonUpdate={};
        jsonUpdate[oreName]=this.currentUser.getOreAmountFromString(oreName) + amount;
        jsonUpdate["credit"]=this.currentUser.credit - costFinal;
      this.db.object('users/' + this.currentUser.uid).update(
        jsonUpdate
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


  searchNewAsteroid(num: number) {
    this.db.object('users/' + this.currentUser.uid + '/numAsteroid').set(num);
  }
}
