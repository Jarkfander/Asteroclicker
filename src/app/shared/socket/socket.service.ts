import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';


@Injectable()
export class SocketService {

  private url = environment.socketUrl;

  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  incrementOre(userId: string,oreName: string, delta: number) {
    const json = {};

    json['user'] = userId;
    json['ore'] = oreName;
    json['amount'] = delta;

    this.socket.emit('incrementOre', json);
  }

  upgradeShipCredit(userId: string,upgradeName: string) {
    const json = {};

    json['user'] = userId;
    json['upgrade'] = upgradeName;

    this.socket.emit('upgradeShipCredit', json);
  }

  upgradeShipOre(userId: string,upgradeName: string) {
    const json = {};

    json['user'] = userId;
    json['upgrade'] = upgradeName;

    this.socket.emit('upgradeShipOre', json);
  }

  updateUpgradeTimer(userId: string,upgradeName: string) {
    const json = {};

    json['user'] = userId;
    json['upgrade'] = upgradeName;

    this.socket.emit('updateUpgradeTimer', json);
  }


  sellOre(userId: string,oreName: string, amount: number) {
    const json = {};

    json['user'] = userId;
    json['ore'] = oreName;
    json['amount'] = amount;

    this.socket.emit('sellOre', json);
  }

  buyOre(userId: string,oreName: string, amount: number) {
    const json = {};

    json['user'] = userId;
    json['ore'] = oreName;
    json['amount'] = amount;

    this.socket.emit('buyOre', json);
  }

  searchAsteroid(userId: string) {
    const json = {};

    json['user'] = userId;

    this.socket.emit('searchAster', json);
  }

  chooseAsteroid(userId: string,ind: number) {
    const json = {};

    json['user'] = userId;
    json['ind'] = ind;

    this.socket.emit('chooseAsteroid', json);
  }

  updateAsteroidTimer(userId: string,distance: number) {
    const json = {};

    json['user'] = userId;
    json['distance'] = distance;
    this.socket.emit('updateAsteroidTimer', json);
  }

  rejectResults(userId: string) {
    const json = {};

    json['user'] = userId;

    this.socket.emit('rejectResults', json);
  }

  removeChest(userId: string,numberOfChest:number) {
    const json = {};
    json['numberOfChest'] = numberOfChest - 1;
    json['user'] = userId;

    this.socket.emit('removeChest', json);
  }

  newChest(userId: string) {
    const json = {};
    json['userID'] = userId;
    this.socket.emit('newChest', json);
  }

  deleteEvent(userId: string) {
    const json = {};
    json['userID'] = userId;
    this.socket.emit('deleteEvent', json);
  }

  initializeUser(userId: string, email: string) {
    const json = {};
    json['user'] = userId;
    json['email'] = email;
    this.socket.emit('initializeUser', json);
  }

  reachFrenzy(userId: string) {
    const json = {};
    json['user'] = userId;
    this.socket.emit('reachFrenzy', json);
  }
  
  nextArrow(userId: string, keyCode: number) {
    const json = {};
    json['user'] = userId;
    json['keyCode'] = keyCode;
    this.socket.emit('nextArrow', json);
  }
}
