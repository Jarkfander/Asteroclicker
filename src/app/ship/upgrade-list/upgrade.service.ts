import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import { MineRate } from '../upgrade-class/mineRate';
import { Research } from '../upgrade-class/research';
import { Storage } from '../upgrade-class/storage';

@Injectable()
export class UpgradeService {

  db: AngularFireDatabase;
  storage: Storage[];
  mineRate: MineRate[];
  research: Research[];

  storageLoad: boolean = false;
  mineRateLoad: boolean = false;
  researchLoaded: boolean = false;

  constructor(db: AngularFireDatabase) {
    this.storage = new Array();
    this.mineRate = new Array();
    this.research = new Array();

    this.db = db;
    this.db.object('storage').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillStock(snapshot);
      });
    this.db.object('mineRate').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillMineRate(snapshot);
      });
    this.db.object('research').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillResearch(snapshot);
      });
  }

  // create the tab of stock
  FillStock(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.storage.push(new Storage(i, snapshot[i].cost, snapshot[i].capacity, snapshot[i].time === undefined ? 10 : snapshot[i].time));
    }
    this.storageLoad = true;
  }

  // create the tab of MineRate
  FillMineRate(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.mineRate.push(new MineRate(i, snapshot[i].cost, snapshot[i].baseRate,
        snapshot[i].maxRate, snapshot[i].time === undefined ? 10 : snapshot[i].time));
    }
    this.mineRateLoad = true;
  }

  // create the tab of Research
  FillResearch(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.research.push(new Research(i, snapshot[i].cost, snapshot[i].time, snapshot[i].searchTime));
    }
    this.researchLoaded = true;
  }
}

