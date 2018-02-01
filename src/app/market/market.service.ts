import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../signin/auth.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';

export interface IOreCosts {
  carbon: number[];
  gold: number[];
  hyperium: number[];
  iron: number[];
  titanium: number[];
}

@Injectable()
export class MarketService {

  allCurrentOreCosts: IOreCosts;
  allHistoryOreCosts: IOreCosts;
  
  currentCostsSubject = {};
  historyCostsSubject = {};

  marketLoad: boolean;

  constructor(db: AngularFireDatabase) {

    this.allCurrentOreCosts = {} as IOreCosts;
    this.allHistoryOreCosts = {} as IOreCosts;
    db.object('trading').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        const keys = Object.keys(snapshot);
        for (let i = 0; i < keys.length; i++) {
          this.allCurrentOreCosts[keys[i]] = new Array();
          this.allHistoryOreCosts[keys[i]] = new Array();

          this.currentCostsSubject[keys[i]] = new Subject();
          this.historyCostsSubject[keys[i]] = new Subject();

          db.database.ref('trading/' + keys[i] + "/lastMinute")
            .on("child_added", (child) => {
              this.allCurrentOreCosts[keys[i]].push(child.val());
              if(this.allCurrentOreCosts[keys[i]].length>500){
                this.allCurrentOreCosts[keys[i]].shift();
              }
              this.currentCostsSubject[keys[i]].next(child.val());
            });
          db.database.ref('trading/' + keys[i] + "/lastDay")
            .on("child_added", (child) => {
              this.allHistoryOreCosts[keys[i]].push(child.val());
              if(this.allHistoryOreCosts[keys[i]].length>24){
                this.allHistoryOreCosts[keys[i]].shift();
              }
              this.historyCostsSubject[keys[i]].next(child.val());
            });
        }
      });
  }
}


