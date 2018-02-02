import { Injectable } from '@angular/core';
import { Storage } from '../../ship/upgrade-class/storage';
import { MineRate } from '../../ship/upgrade-class/mineRate';
import { Research } from '../../ship/upgrade-class/research';
import { Engine } from '../../ship/upgrade-class/engine';
import { QG } from '../../ship/upgrade-class/qg';
import { storage } from 'firebase/app';

@Injectable()
export class ResourcesService {

  storage: Storage[];
  mineRate: MineRate[];
  research: Research[];
  engine: Engine[];
  QG: QG[];

  resourcesLoaded : boolean=false;

  constructor() {
  }

  public FillAll(data) {
    this.FillEngine(data.engine);
    this.FillMineRate(data.mineRate);
    this.FillQG(data.QG);
    this.FillResearch(data.research);
    this.FillStorage(data.storage);

    this.resourcesLoaded=true;
  }

  // create the tab of storage
  FillStorage(snapshot) {
    this.storage=new Array();
    for (let i = 0; i < snapshot.length; i++) {
      this.storage.push(new Storage(i, snapshot[i].cost, snapshot[i].capacity, snapshot[i].time));
    }
  }

  // create the tab of MineRate
  FillMineRate(snapshot) {
    this.mineRate=new Array();
    for (let i = 0; i < snapshot.length; i++) {
      this.mineRate.push(new MineRate(i, snapshot[i].cost, snapshot[0].baseRate, snapshot[i].baseRate,
        snapshot[i].maxRate, snapshot[i].frenzyTime, snapshot[i].time));
    }
  }

  // create the tab of Research
  FillResearch(snapshot) {
    this.research=new Array();
    for (let i = 0; i < snapshot.length; i++) {
      this.research.push(new Research(i, snapshot[i].cost, snapshot[i].time, snapshot[i].searchTime,
        snapshot[i].maxDist, snapshot[i].minDist));
    }
  }


  // create the tab of engine
  FillEngine(snapshot) {
    this.engine=new Array();
    for (let i = 0; i < snapshot.length; i++) {
      this.engine.push(new Engine(i, snapshot[i].cost, snapshot[i].time, snapshot[i].speed));
    }
  }

  // create the tab of QG
  FillQG(snapshot) {
    this.QG=new Array();
    for (let i = 0; i < snapshot.length; i++) {
      this.QG.push(new QG(i, snapshot[i].cost, snapshot[i].time, snapshot.numberOfCargo));
    }
  }

}
