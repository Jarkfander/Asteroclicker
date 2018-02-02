import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../signin/auth.service';

export interface IOreAmounts {
  carbon: number;
  iron: number;
  titanium: number;
  gold: number;
  hyperium: number;
}


@Injectable()
export class OreService {

  constructor(private db: AngularFireDatabase, private authS: AuthService) {

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
