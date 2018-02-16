import { UserService, IUser } from './../shared/user/user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { PromiEvent } from 'web3/types';
import { Injectable } from '@angular/core';
import { NexiumService } from '../web3-m/nexium.service';
import { IBoost, IUserBoost } from './boost';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { interval } from 'rxjs/observable/interval';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { mergeAll, scan, reduce, take, map, tap, catchError, filter, mergeMap, delay, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { SocketService } from '../shared/socket/socket.service';
import { ToasterService } from '../shared/toaster/toaster.service';
import { Toast, IToast } from '../shared/toaster/models/toast';

@Injectable()
export class BoostService {

  public boosts: IBoost[];
  public inventorySubject = new BehaviorSubject<IUserBoost[]>(null);
  public inventory$ = this.inventorySubject.asObservable();

  constructor(
              private nxcS: NexiumService,
              private db: AngularFireDatabase,
              private socketS: SocketService,
              private userS: UserService,
              private toasterS: ToasterService
  ) {
    this.getStore()
      .subscribe((boosts: IBoost[]) => this.boosts = boosts);

    this.getInventory()
      .subscribe((inventory: IUserBoost[]) => this.inventorySubject.next(inventory));
    this.socketS.upsertUserBoosts();
  }

  /** transform extra Data */
  private extraData(index: number): string {
    const hex = index.toString(16);
    return hex.length === 1 ? `0x0${hex}` : `0x${hex}`;
  }

  /**
   * Get all boost from the store
  */
  private getStore(): Observable<IBoost[]> {
    return this.db.list<IBoost>('boosts')
                  .valueChanges<IBoost>()
                  .pipe(
                    take(1),
                    map((boosts: IBoost[], index: number) => boosts.map((boost: IBoost) => {
                      return { ...boost, id: index, extraData: this.extraData(index) };
                    }))
                  );
  }

  /** 
   * Get Inventory of the current user and update subject
  */
  public getInventory(): Observable<IUserBoost[]> {
    return this.db.list<any>(`users/${this.userS.currentUser.uid}/boosts`)
                  .valueChanges<any[]>()
                  .pipe(
                    map((boosts: any[]) => {
                      return boosts
                        .map((boost) => {
                          return { ...boost, ...this.boosts[0], quantity: (boost.boughtQuantity - boost.usedQuantity) };
                        })
                        .filter((boost: IUserBoost) => boost.quantity > 0);
                    })
                  );
  }

  /**
   * Activate the boost
   * @param {IUserBoost} boost The boost to activate
   */
  public activate(boost: IUserBoost) {
    this.socketS.activateBoost(boost.id);
    this.toasterS.comics('Boost activated', 'boost-activated');
  }

  /**
   * Buy a boost in Nexium
   * @param {IBoose} boost The boost you want to buy
   * @param {number} amount Amount of boost to buy
   */
  public buyBoost(boost: IBoost, amount: number): Observable<any> {
    const call = this.nxcS.approveAndCall(environment.addresses.boostMarket, boost.price * amount, boost.extraData)
      .on('transactionHash', () => this.toasterS.comics('Shipping incoming', 'tx-start'))
      .then();

    return fromPromise(call).pipe(
      take(1),
      tap(() => this.socketS.upsertUserBoosts()),
      map(() => this.toasterS.comics('Your boost has arrived', 'tx-arrived')),
      catchError((err) => of(this.toasterS.comics('Something happened, transaction cancelled', 'tx-error' )))
    )
  }
}
