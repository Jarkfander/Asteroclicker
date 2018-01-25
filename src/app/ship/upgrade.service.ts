import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import { Storage } from './upgrade-class/storage';
import { MineRate } from './upgrade-class/mineRate';
import { Research } from './upgrade-class/research';
import { Engine } from './upgrade-class/engine';
import { OreService, IOreInfos } from '../ore/ore.service';
import { QG } from './upgrade-class/qg';
import { IUserUpgrade } from '../shared/user/user.service';


@Injectable()
export class UpgradeService {

  public activeUserUpgrade$ = new Subject<IUserUpgrade>();
  db: AngularFireDatabase;

  storage: Storage[];
  mineRate: MineRate[];
  research: Research[];
  engine: Engine[];
  QG: QG[];

  storageLoad: boolean = false;
  mineRateLoad: boolean = false;
  researchLoaded: boolean = false;
  engineLoad: boolean = false;

  oreInfos: IOreInfos;

  constructor(db: AngularFireDatabase, private oreS: OreService) {
    this.storage = new Array();
    this.mineRate = new Array();
    this.research = new Array();
    this.engine = new Array();
    this.QG = new Array();

    this.db = db;

    this.oreS.OreInfos.take(1).subscribe(
      (oreInfos: IOreInfos) => {
        this.oreInfos = oreInfos;
        this.db.object('research').valueChanges().take(1).subscribe(
          (snapshot: any) => {
            this.FillResearch(snapshot);
          });
      }
    );

    this.db.object('storage').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillStock(snapshot);
      });

    this.db.object('mineRate').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillMineRate(snapshot);
      });


    this.db.object('engine').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillEngine(snapshot);
      });

    this.db.object('QG').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillQG(snapshot);
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
      this.mineRate.push(new MineRate(i, snapshot[i].cost, snapshot[0].baseRate, snapshot[i].baseRate,
        snapshot[i].maxRate, snapshot[i].frenzyTime, snapshot[i].time));
    }
    this.mineRateLoad = true;
  }

  // create the tab of Research
  FillResearch(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.research.push(new Research(i, snapshot[i].cost, snapshot[i].time, snapshot[i].searchTime,
        snapshot[i].maxDist, snapshot[i].minDist, this.researchNewOre(i)));
    }
    this.researchLoaded = true;
  }

  researchNewOre(lvl: number) {
    const oreInfoKey = Object.keys(this.oreInfos);
    for (let i = 0; i < oreInfoKey.length; i++) {
      if (lvl === this.oreInfos[oreInfoKey[i]].lvlOreUnlock) {
        return this.oreInfos[oreInfoKey[i]].name;
      }
    }
    return undefined;
  }

  // create the tab of engine
  FillEngine(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.engine.push(new Engine(i, snapshot[i].cost, snapshot[i].time, snapshot[i].speed));
    }
    this.engineLoad = true;
  }

  // create the tab of QG
  FillQG(snapshot) {
    for (let i = 0; i < snapshot.length; i++) {
      this.QG.push(new QG(i, snapshot[i].cost, snapshot[i].time, snapshot.numberOfCargo));
    }
  }
}
