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

  OreCostsSubjectCarbon = new Subject<number[]>();
  OreCostsSubjectTitanium = new Subject<number[]>();
  marketLoad: boolean = false;


  constructor(db: AngularFireDatabase) {
    this.db = db;
    this.currentOresCosts = new OreCosts();
    this.oreTrends = new OreTrends();
    this.db.object('trading/carbon').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillOreCostsInitCarbon(snapshot);
        this.marketLoad = true;
      });

    this.db.object('trading/titanium').valueChanges().subscribe(
      (snapshot: any) => {
        this.FillOreCostsInitTitanium(snapshot);
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
  FillOreCostsInitCarbon(snapshot) {
    this.currentOresCosts.carbonCosts = snapshot;
    this.OreCostsSubjectCarbon.next(this.currentOresCosts.carbonCosts);
  }

    // create the tab of stock
    FillOreCostsInitTitanium(snapshot) {
      this.currentOresCosts.titaniumCosts = snapshot;
      this.OreCostsSubjectTitanium.next(this.currentOresCosts.titaniumCosts);
    }

  UpdateOreTrend(delta: number, oreName: string) {
    this.db.object('trend/' + oreName).set(this.oreTrends.getTrendFromString(oreName) + delta);
  }
}


