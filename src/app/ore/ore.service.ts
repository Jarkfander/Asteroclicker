import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../signin/auth.service';

export interface IOreInfos {
  carbon: IOreInfo;
  iron: IOreInfo;
  titanium: IOreInfo;
  gold: IOreInfo;
  hyperium: IOreInfo;
}

export interface IOreInfo {
  order: number;
  name: string;
  maxValue: number;
  meanValue: number;
  minValue: number;
  miningSpeed: number;
  searchNewOre: number;
}

export interface IOreAmounts {
  carbon: number;
  iron: number;
  titanium: number;
  gold: number;
  hyperium: number;
}


@Injectable()
export class OreService {

  public oreInfos: IOreInfos;

  constructor(private db: AngularFireDatabase, private authS: AuthService) {
    // Get all ore infos from the DB
    this.db.object('oreInfo')
      .valueChanges<IOreInfos>()
      .first()
      .subscribe((oreInfos: IOreInfos) => this.oreInfos = oreInfos);
  }

  // TODO : Remove
  get OreInfos(): Observable<IOreInfos>{
    return  this.db.object('oreInfo').valueChanges<IOreInfos>();
  }

  /** Get the infos of an ore based on its name */
  public getOreInfoByName(name: string): Observable<IOreInfo> {
    return  this.db.object('oreInfo/' + name).valueChanges<IOreInfo>();
  }

  get OreAmounts(): Observable<IOreAmounts>{
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/ore').valueChanges<IOreAmounts>());
  }

  getOreAmountByString(name: string): Observable<number> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/ore/' + name).valueChanges<number>());
  }

}
