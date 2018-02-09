import { UserService, IUser } from './../shared/user/user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { PromiEvent } from 'web3/types';
import { Injectable } from '@angular/core';
import { NexiumService } from '../web3-m/nexium.service';
import { IBoost, IUserBoost } from './boost';

import { Observable } from 'rxjs/Observable';
import { take, map, tap, reduce } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import { SocketService } from '../shared/socket/socket.service';

@Injectable()
export class BoostService {

  public boosts: IBoost[];
  public inventory: IUserBoost[];

  constructor(private nxcS: NexiumService,
              private db: AngularFireDatabase,
              private socketS: SocketService,
              private userS: UserService) {
                this.getStore()
                .do(console.log)
                .subscribe((boosts: IBoost[]) => this.boosts = boosts);
              }

  private getStore(): Observable<IBoost[]> {
    return this.db.list<IBoost>('boosts')
                  .valueChanges<IBoost>()
                  .pipe(
                    take(1),
                    map((boosts: IBoost[], index: number) => boosts.map((boost: IBoost) => {
                      return { ...boost, id: index, extraData: '0x0' + index.toString(16) };
                    }))
                  );
  }

  public getInventory(): Observable<IUserBoost[]> {
    return this.db.list<IUserBoost>(`users/${this.userS.currentUser.uid}/boosts`)
                  .valueChanges<IUserBoost>()
                  .pipe(
                    map((boosts: IUserBoost[], index: number) => boosts.map((boost: IUserBoost) => {
                      return { ...boost, ...this.boosts[index] };
                    }))
                  );
  }

  public activate(boost: IUserBoost) {
    this.socketS.activateBoost(this.userS.currentUser.uid, boost.id);
  }

  /**
   * Buy a boost in Nexium
   * @param {IBoose} boost The boost you want to buy
   * @param {number} amount Amount of boost to buy
   */
  public buyBoost(boost: IBoost, amount: number): PromiEvent<any> {
    return this.nxcS.approveAndCall(environment.addresses.boostMarket, boost.price * amount, boost.extraData);
  }
}
