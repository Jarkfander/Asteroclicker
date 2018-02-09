import { Injectable } from '@angular/core';
import { NexiumService } from '../web3-m/nexium.service';
import { IBoost } from './boost';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class BoostService {

  constructor(private nxcS: NexiumService) {

  }

  public getInventory(): Observable<IBoost[]> {
    return of([{
      name: 'super booost',
      description: 'Un super boost, pour de vrai',
      price: 10000
    }]);
  }

  public getStore(): Observable<IBoost[]> {
    return of([{
      name: 'super booost',
      description: 'Un super boost, pour de vrai',
      price: 10000
    }, {
      name: 'Another Boost',
      description: 'En anglais cette fois',
      price: 10000
    }]);
  }

  public buyBoost() {

  }
}
