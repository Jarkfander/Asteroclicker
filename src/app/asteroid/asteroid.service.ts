import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../signin/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';

import 'rxjs/add/operator/mergeMap';

export interface IAsteroid {
  capacity: number;
  currentCapacity: number;
  collectible: number;
  ore: string;
  purity: number;
  seed: string;
  timeToGo: number;
}

@Injectable()
export class AsteroidService {

  constructor(private db: AngularFireDatabase, private authS: AuthService) { }

  get asteroid$(): Observable<IAsteroid> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/asteroid').valueChanges<IAsteroid>())
  }

  get isEmpty(): Observable<boolean> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/asteroid').valueChanges<IAsteroid>())
      .map((asteroid: IAsteroid) => (asteroid.currentCapacity - asteroid.collectible) === 0);
  }

  /* get state():Observable<number> {
     return this.authS.UserId
       .mergeMap((id: String) => this.db.object('users/' + id + '/asteroid').valueChanges<IAsteroid>()
       .map((asteroid:IAsteroid)=> asteroid.currentCapacity == asteroid.capacity ? 4 : 
         Math.floor((asteroid.currentCapacity / asteroid.capacity) * 5))
       )
   }*/
   

}
