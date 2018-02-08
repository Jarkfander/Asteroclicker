import { Injectable } from '@angular/core';
import * as Web3 from 'web3-eth'
import * as ZeroClientProvider from "web3-provider-engine/zero"
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { IMessage } from './message';
import { ABIDefinition, Contract } from 'web3/types';

@Injectable()
export class Web3Service {

  private web3 : any;
  public addressSubject = new BehaviorSubject<string>(null);
  public address$: Observable<string>;
  public authWindow: Window;

  constructor() {
  
    this.web3 = new Web3 ( Web3.givenProvider || this.provider);
    this.address$ = this.addressSubject.asObservable();
  }

  /** return the defaut account stored by Web3 */
  public get defaultAccount(): string {
    return this.web3.defaultAccount;
  }

  /**
   * Load the current address and store it into the default account of web3
   */
  public setAddress(): Promise<void> {
    return this.web3.getAccounts()
      .then((accounts: string[]) => this.web3.defaultAccount = accounts[0])
      .then((account: string) => this.addressSubject.next(account));
  }

  /**
   * Instanciate a contract
   * @param abi : JSON interface defining the contract
   * @param address : contract address
   */
  public createContract(abi: any, address: string): Contract {
    return new this.web3.Contract(abi, address);
  }

  /*************************************************
   * OWN PROVIDER
   */

  /**
   * return local provider if no current provider in the browser
   */
  private get provider() {
    return ZeroClientProvider({
      rpcUrl: environment.provider,
      getAccounts: (cb) => {
        cb(null, this.addressSubject.getValue() ? [this.addressSubject.getValue()] : []);
      }
    });
  }

  /**
   * Send a message to the auth client
   * @param {IMessage} message  message to send to auth client
   */
  public sendData(message: IMessage) {
    this.authWindow.postMessage(JSON.stringify(message), environment.authClient);
  }

}
