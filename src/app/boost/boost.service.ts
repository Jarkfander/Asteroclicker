import { UserService, IUser } from './../shared/user/user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { PromiEvent } from 'web3/types';
import { Injectable } from '@angular/core';
import { NexiumService } from '../web3-m/nexium.service';
import { IBoost, IUserBoost } from './boost';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { take, map, tap, reduce, filter, mergeMap, scan } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import { SocketService } from '../shared/socket/socket.service';

@Injectable()
export class BoostService {

  public boosts: IBoost[];
  public inventorySubject = new BehaviorSubject<IUserBoost[]>(null);
  public inventory$ = this.inventorySubject.asObservable();

  constructor(
              private nxcS: NexiumService,
              private db: AngularFireDatabase,
              private socketS: SocketService,
              private userS: UserService
  ) {
    this.getStore().subscribe((boosts: IBoost[]) => this.boosts = boosts);
    this.changeInventory();
  }

  /** Updage Inventory */
  public changeInventory() {
    this.getInventory().pipe(take(1))
        .subscribe((inventory: IUserBoost[]) => this.inventorySubject.next(inventory));
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
  private getInventory(): Observable<IUserBoost[]> {
    return this.db.list<any>(`users/${this.userS.currentUser.uid}/boosts`)
                  .valueChanges<any>()
                  .pipe(
                    map((boosts: any[], index: number) => boosts.map((boost: any) => {
                      return { ...boost, ...this.boosts[index], quantity: (boost.boughtQuantity - boost.usedQuantity) };
                    })),
                    mergeMap((boosts) => boosts),
                    filter((boost: IUserBoost) => boost.quantity > 0),
                    scan((acc: IUserBoost[], add: IUserBoost) => acc = [...acc, add], [])
                  );
  }

  /**
   * Activate the boost
   * @param {IUserBoost} boost The boost to activate
   */
  public activate(boost: IUserBoost) {
    this.socketS.activateBoost(boost.id);
  }

  /**
   * Buy a boost in Nexium
   * @param {IBoose} boost The boost you want to buy
   * @param {number} amount Amount of boost to buy
   */
  public buyBoost(boost: IBoost, amount: number): Promise<any> {
    return this.nxcS.approveAndCall(environment.addresses.boostMarket, boost.price * amount, boost.extraData)
      .then((tx) => this.changeInventory());
  }
}
