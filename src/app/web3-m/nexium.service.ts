import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Contract, PromiEvent, EventEmitter, TransactionReceipt } from 'web3/types';
import { abi } from './abi/nexium.abi';
import { Web3Manager } from '../web3-m/web3Manager';
import { Subject } from 'rxjs/Subject';
import { Web3Service } from './web3.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class NexiumService {

  private contract: Contract;
  public nexiumSubject = new Subject<number>();
  public nexium$: Observable<number>;
  public amount: number;

  constructor(private web3S: Web3Service) {
    this.contract = this.web3S.createContract(abi, environment.addresses.nexium);
    this.web3S.address$.subscribe((address: string) => this.changeNexium());
  }

  /** Reload the amount of nexium of the default account */
  public changeNexium() {
    this.balanceOf(this.web3S.defaultAccount)
      .then((amount: number) => this.nexiumSubject.next(amount));
  }

  /**
   * Return the amount of nexium of the address
   * @param {string} address Address of the account to check
   */
  public balanceOf(address: string): Promise<number> {
    return this.contract.methods.balanceOf(address)
      .call()
      .then((amount: string) => parseInt(amount, 10));
  }
}

