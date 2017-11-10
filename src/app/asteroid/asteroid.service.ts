import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { Asteroid } from './asteroid';

@Injectable()
export class AsteroidService {
  db: AngularFireDatabase;
  asteroidTypes: Asteroid[];

  AsteroidSubject = new Subject<any[]>();
  asteroidLoad: boolean = false;

  constructor(db: AngularFireDatabase) {
    this.db = db;
    this.asteroidTypes = new Array<Asteroid>();

    this.db.object('typeAste').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillAsteroid(snapshot);
        this.asteroidLoad = true;
      });
  }

  FillAsteroid(snapshot) {
    for(var i =0;i<snapshot.length;i++){
      this.asteroidTypes.push(new Asteroid(snapshot[i].maxstock, snapshot[i].mineRate,snapshot[i].ore));
    }
    this.AsteroidSubject.next( this.asteroidTypes );
  }

}
