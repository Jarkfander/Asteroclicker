import { Injectable } from '@angular/core';
import { Storage } from './storage';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import { MineRate } from './mineRate';

@Injectable()
export class UpgradeService {

  db: AngularFireDatabase;
  storage: Storage[];
  mineRate: MineRate[];

  storageLoad: boolean = false;
  mineRateLoad: boolean = false;

  upgradeStockSubject = new Subject<Storage[]>();
  upgradeMineRateSubject = new Subject<MineRate[]>();

  constructor(db: AngularFireDatabase) {
    this.storage = new Array();
    this.mineRate = new Array();
    this.db = db;
    this.db.object('storage').valueChanges().take(1).subscribe(
      (snapshot: any) => {
          this.FillStock(snapshot);
      });
    this.db.object('mineRate/carbon').valueChanges().take(1).subscribe(
      (snapshot: any) => {
          this.FillMineRate(snapshot);
      });
  }

  // create the tab of stock
  FillStock(snapshot) {
    for (let i = 0 ; i < snapshot.length ; i++) {
        this.storage.push(new Storage(i, snapshot[i].cost, snapshot[i].capacity));
    }
    this.upgradeStockSubject.next(this.storage);
    this.storageLoad=true;
  }

  // create the tab of MineRate
  FillMineRate(snapshot) {
    for (let i = 0 ; i < snapshot.length ; i++) {
        this.mineRate.push(new MineRate(i, snapshot[i].cost, snapshot[i].baseRate, snapshot[i].maxRate));
    }
    this.mineRateLoad=true;
    this.upgradeMineRateSubject.next(this.mineRate);
  }
}

