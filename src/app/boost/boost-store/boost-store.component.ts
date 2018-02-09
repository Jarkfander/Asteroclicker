import { BoostService } from './../boost.service';
import { Component, OnInit } from '@angular/core';

import { IBoost } from './../boost';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'boost-store',
  templateUrl: './boost-store.component.html',
  styleUrls: ['./boost-store.component.scss']
})
export class BoostStoreComponent implements OnInit {

  public boosts: IBoost[];
  public boost: IBoost;

  constructor(private boostS: BoostService) { }

  public buy(amount: number) {
    this.boostS.buyBoost(this.boost, amount)
      .then((tx) => console.log(tx))
      .catch((err) => console.log(err));
  }

  ngOnInit() {
    this.boosts = this.boostS.boosts;
    this.boost = this.boosts[0];
  }
}
