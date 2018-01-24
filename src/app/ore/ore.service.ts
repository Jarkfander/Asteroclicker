import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../signin/auth.service';

export interface IOreInfos{
  carbon: IOreInfo;
  gold: IOreInfo;
  hyperium: IOreInfo;
  iron: IOreInfo;
  titanium: IOreInfo;
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
  gold: number;
  hyperium: number;
  iron: number;
  titanium: number;
}


@Injectable()
export class OreService {

  constructor(private db: AngularFireDatabase, private authS:AuthService) {
  }

  get OreInfos() : Observable<IOreInfos>{
    return  this.db.object('oreInfo').valueChanges<IOreInfos>();
  }

  getOreInfoByString(name : string) : Observable<IOreInfo>{
    return  this.db.object('oreInfo/'+name).valueChanges<IOreInfo>();
  }

  get OreAmounts() : Observable<IOreAmounts>{
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/ore').valueChanges<IOreAmounts>())
  }

  getOreAmountByString(name : string) : Observable<number>{
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/ore/' + name).valueChanges<number>())
  }

}