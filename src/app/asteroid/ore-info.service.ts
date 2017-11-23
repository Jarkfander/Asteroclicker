import { Injectable } from '@angular/core';
import { OreInfo } from './oreInfo';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class OreInfoService {

  public oreInfo: OreInfo[];

  public oreInfoLoaded = false;

  constructor(db: AngularFireDatabase) {
    this.oreInfo = new Array();
    db.object('oreInfo').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillOreInfo(snapshot);
      });
  }

  // create the tab of stock
  FillOreInfo(snapshot) {
    const key = Object.keys(snapshot);
    for (let i = 0; i < key.length; i++) {
      this.oreInfo.push(new OreInfo(key[i], snapshot[key[i]].maxValue, snapshot[key[i]].meanValue,
        snapshot[key[i]].minValue, snapshot[key[i]].miningSpeed));
    }
    this.oreInfoLoaded = true;
  }

  getOreInfoByString(name: string): OreInfo {
    for (let i = 0; i < this.oreInfo.length; i++) {
      if (this.oreInfo[i].name == name) {
        return this.oreInfo[i];
      }
    }
  }

}
