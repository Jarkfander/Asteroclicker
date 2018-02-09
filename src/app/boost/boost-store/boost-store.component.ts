import { BoostService } from './../boost.service';
import { Component, OnInit } from '@angular/core';

import { IBoost } from './../boost';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'boost-store',
  templateUrl: './boost-store.component.html',
  styleUrls: ['./boost-store.component.scss']
})
export class BoostStoreComponent implements OnInit {

  public boosts$: Observable<IBoost[]>;
  public boost: IBoost;

  constructor(private boostS: BoostService) { }

  ngOnInit() {
    this.boosts$ = this.boostS.getStore().pipe(
      tap((boosts: IBoost[]) => this.boost = boosts[0])
    );
  }
}
