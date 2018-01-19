import { Injectable } from '@angular/core';
import { IAsteroid } from '../asteroid/asteroid.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../signin/auth.service';


export interface ISearch {
  result: IAsteroid[];
  timer: number;
  start: number;
}

@Injectable()
export class SearchService {

  constructor(private db: AngularFireDatabase, private authS: AuthService) { }

  get search(): Observable<ISearch> {
    return this.authS.UserId
      .mergeMap((id: String) => this.db.object('users/' + id + '/search').valueChanges<ISearch>())
  }
  
}
