import { Injectable } from '@angular/core';
import { OreCosts } from './oreCosts';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MarketService {

  db: AngularFireDatabase;
  currentOresCosts: OreCosts;
  OreCostsSubject = new Subject<any[]>();
  marketLoad: boolean = false;

  constructor(db: AngularFireDatabase) {
    this.db = db;
    this.currentOresCosts = new OreCosts();

    this.db.object('trading/carbon').valueChanges().subscribe(
      (snapshot: any) => {
          this.FillOreCostsInit(snapshot);
          this.marketLoad = true;
      });
  }

  // create the tab of stock
  FillOreCostsInit(snapshot) {
    this.currentOresCosts.carbonCosts = snapshot;
    this.OreCostsSubject.next(this.currentOresCosts.carbonCosts);
  }
}


