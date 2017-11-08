import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AsteroidService {
  db: AngularFireDatabase;
  asteroidManaged: any[];

  AsteroidSubject = new Subject<any[]>();
  asteroidLoad: boolean = false;

  constructor(db: AngularFireDatabase) {
    this.db = db;
    this.asteroidManaged = new Array<any>();

    this.db.object('typeAste').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillAsteroid(snapshot);
        this.asteroidLoad = true;
      });
  }

  FillAsteroid(snapshot) {
    this.asteroidManaged = snapshot;
    this.AsteroidSubject.next( this.asteroidManaged );
  }

}
