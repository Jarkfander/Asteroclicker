import { Component, OnInit } from '@angular/core';

import { IBoost } from './../boost';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators';
import { ToasterService } from '../../shared/toaster/toaster.service';
import { BoostService } from './../boost.service';

@Component({
  selector: 'boost-store',
  templateUrl: './boost-store.component.html',
  styleUrls: ['./boost-store.component.scss']
})
export class BoostStoreComponent implements OnInit {

  public boosts: IBoost[];
  public boost: IBoost;

  constructor(private boostS: BoostService, private toasterS: ToasterService) { }

  public buy(amount: number) {
    this.boostS.buyBoost(this.boost, amount)
      .then((tx) => this.toasterS.success('Your boost has arrived'))
      .catch((err) => console.log(err));
  }

  ngOnInit() {
    this.boosts = this.boostS.boosts;
    this.boost = this.boosts[0];
  }
}
