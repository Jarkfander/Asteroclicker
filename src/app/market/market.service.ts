import { Injectable } from '@angular/core';
import { OreCosts } from './oreCosts';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { OreTrends } from './oreTrends';

@Injectable()
export class MarketService {

  db: AngularFireDatabase;
  currentOresCosts: OreCosts;
  oreTrends: OreTrends;

  OreCostsSubject = new Subject<number[]>();
  marketLoad: boolean = false;


  constructor(db: AngularFireDatabase) {
    this.db = db;
    this.currentOresCosts = new OreCosts();
    this.oreTrends = new OreTrends();
    this.db.object('trading/carbon').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillOreCostsInit(snapshot);
        this.marketLoad = true;
      });

    this.db.object('trend').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillOreTrends(snapshot);
      });
  }

  FillOreTrends(snapshot) {
    this.oreTrends.carbonTrend = snapshot.carbon;
  }
  // create the tab of stock
  FillOreCostsInit(snapshot) {
    this.currentOresCosts.carbonCosts = snapshot;
    this.OreCostsSubject.next(this.currentOresCosts.carbonCosts);
  }

  UpdateOreTrend(delta : number,oreName : string){
    this.db.object('trend/'+oreName).set(this.oreTrends.getTrendFromString(oreName)+delta);
  }
}


