import { Component, OnInit } from '@angular/core';

import { IBoost } from './../boost';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators';
import { BoostService } from './../boost.service';

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
    this.boostS.buyBoost(this.boost, amount).subscribe();
  }

  ngOnInit() {
    this.boosts = this.boostS.boosts;
    this.boost = this.boosts[0];
  }
}
