import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import { MineRate } from '../upgrade-class/mineRate';
import { Research } from '../upgrade-class/research';
import { Storage } from '../upgrade-class/storage';
import { Engine } from '../upgrade-class/engine';

@Injectable()
export class UpgradeService {

  db: AngularFireDatabase;
  storage: Storage[];
  mineRate: MineRate[];
  research: Research[];
  engine: Engine[];

  storageLoad: boolean = false;
  mineRateLoad: boolean = false;
  researchLoaded: boolean = false;
  engineLoad: boolean = false;

  constructor(db: AngularFireDatabase) {
    this.storage = new Array();
    this.mineRate = new Array();
    this.research = new Array();
    this.engine = new Array();

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
    this.db.object('engine').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillEngine(snapshot);
      });
  }

  // create the tab of stock
  FillStock(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.storage.push(new Storage(i, snapshot[i].cost, snapshot[i].capacity, snapshot[i].time));
    }
    this.storageLoad = true;
  }

  // create the tab of MineRate
  FillMineRate(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.mineRate.push(new MineRate(i, snapshot[i].cost, snapshot[i].baseRate,
        snapshot[i].maxRate, snapshot[i].time));
    }
    this.mineRateLoad = true;
  }

  // create the tab of Research
  FillResearch(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.research.push(new Research(i, snapshot[i].cost, snapshot[i].time, snapshot[i].searchTime,
         snapshot[i].maxDist, snapshot[i].minDist));
    }
    this.researchLoaded = true;
  }

  // create the tab of engine
  FillEngine(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.engine.push(new Engine(i, snapshot[i].cost, snapshot[i].time, snapshot[i].speed));
    }
    this.engineLoad = true;
  }
}
