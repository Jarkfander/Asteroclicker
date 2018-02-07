import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Contract, PromiEvent, EventEmitter, TransactionReceipt } from 'web3/types';
import { abi } from './nexium.abi';
import { Web3Manager } from '../web3-m/web3Manager';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class NexiumService {

  public contract: Contract = new Web3Manager.web3.Contract(abi, environment.addresses.nexium);
  public nexiumSubject = new Subject<number>();
  public amount: number;

  constructor() {
    this.changeNexium();
  }


  public changeNexium() {
    Web3Manager.web3.getAccounts()
    .then((address: string) => this.balanceOf(address[0]))
    .then((amount: string) => {
        this.amount = parseInt(amount, 10);
        this.nexiumSubject.next(this.amount);
        console.log(this.amount / 1000);
    })
    .catch((err: Error) => console.log(err) );
  }


  public balanceOf(address: string): Promise<string> {
    return this.contract.methods.balanceOf(address).call();
  }
}

