import { Injectable } from '@angular/core';
import { OreInfos } from './oreInfos';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class OreInfosService {

  public oreInfos: OreInfos[];

  public oreInfoLoaded = false;

  constructor(db: AngularFireDatabase) {
    this.oreInfos = new Array();
    db.object('oreInfo').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillOreInfo(snapshot);
      });
  }

  // create the tab of stock
  FillOreInfo(snapshot) {
    const key = Object.keys(snapshot);
    for (let i = 0; i < key.length; i++) {
      this.oreInfos.push(new OreInfos(key[i], snapshot[key[i]].maxValue, snapshot[key[i]].meanValue,
        snapshot[key[i]].minValue, snapshot[key[i]].miningSpeed));
    }
    this.oreInfoLoaded = true;
  }

  getOreInfoByString(name: string): OreInfos {
    for (let i = 0; i < this.oreInfos.length; i++) {
      if (this.oreInfos[i].name === name) {
        return this.oreInfos[i];
      }
    }
  }

}
