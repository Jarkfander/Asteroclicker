import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MarketService {

  db: AngularFireDatabase;

  oreCosts: {};
  oreHistory: {};

  oreTrends: {};

  oreCostsSubject = {};
  oreHistorySubject = {};

  marketLoad: boolean;

  constructor(db: AngularFireDatabase) {

    this.db = db;
    this.oreCosts = {};
    this.oreHistory = {};
    this.oreTrends = {};

    this.db.object('trading').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        const keys = Object.keys(snapshot);
        for (let i = 0; i < keys.length; i++) {
          this.oreCostsSubject[keys[i]] = new Subject();
          this.oreHistorySubject[keys[i]] = new Subject();
          this.db.object('trading/' + keys[i] + "/recent").valueChanges().subscribe(
            (trad: any) => {
              this.FillOreCosts(keys[i], trad);
              if (i == keys.length - 1) {
                this.marketLoad = true;
              }
            });
          this.db.object('trading/' + keys[i] + "/history").valueChanges().subscribe(
            (histo: any) => {
              this.FillOreHistory(keys[i], histo);
            });
        }
      });

    this.db.object('trend').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillOreTrends(snapshot);
      });
  }

  FillOreTrends(snapshot) {
    this.oreTrends = snapshot;
  }


  FillOreCosts(oreName, snapshot) {
    this.oreCosts[oreName] = snapshot;
    this.oreCostsSubject[oreName].next(snapshot);
  }

  FillOreHistory(oreName, snapshot) {
    this.oreHistory[oreName] = snapshot;
    this.oreHistorySubject[oreName].next(snapshot);
  }

}


