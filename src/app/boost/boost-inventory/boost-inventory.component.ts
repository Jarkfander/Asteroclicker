import { BoostService } from './../boost.service';
import { Component, OnInit } from '@angular/core';

import { IBoost } from './../boost';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'boost-inventory',
  templateUrl: './boost-inventory.component.html',
  styleUrls: ['./boost-inventory.component.scss']
})
export class BoostInventoryComponent implements OnInit {

  public boosts$: Observable<IBoost[]>;
  public boost: IBoost;

  constructor(private boostS: BoostService) { }

  ngOnInit() {
    this.boosts$ = this.boostS.getInventory().pipe(
      tap((boosts: IBoost[]) => this.boost = boosts[0])
    );
  }

}
