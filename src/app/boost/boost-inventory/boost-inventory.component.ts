import { BoostService } from './../boost.service';
import { Component, OnInit } from '@angular/core';

import { IBoost, IUserBoost } from './../boost';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, filter, combineLatest } from 'rxjs/operators';

@Component({
  selector: 'boost-inventory',
  templateUrl: './boost-inventory.component.html',
  styleUrls: ['./boost-inventory.component.scss']
})
export class BoostInventoryComponent implements OnInit {

  public boosts$: Observable<IUserBoost[]>;
  public boost: IUserBoost;

  constructor(private boostS: BoostService) { }

  /** Activate the boost */
  public activate() {
    this.boostS.activate(this.boost);
  }

  ngOnInit() {
    // this.boosts$ = this.boostS.getInventory().pipe(
    this.boosts$ = this.boostS.inventory$.pipe(
      filter((boosts: IUserBoost[]) => !!boosts),
      tap((boosts: IUserBoost[]) => this.boost = boosts[0])
    );
  }

}
