import * as Web3 from 'web3-eth';

export class Web3Manager {
    static web3: Web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
}
