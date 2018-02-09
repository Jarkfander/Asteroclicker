import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ResourcesService } from '../resources/resources.service';
import { IUserBoost } from '../../boost/boost';


@Injectable()
export class SocketService {

  private url = environment.socketUrl;

  private socket;

  constructor(resourceS: ResourcesService) {
    this.socket = io(this.url);
    this.socket.on('sendResources', (message) => {
      resourceS.FillAll(message);
    });
  }

  loadResources(toExecute) {
    this.socket.emit('loadResources', toExecute);
  }

  incrementOre(userId: string, oreName: string, delta: number) {
    const json = {};

    json['user'] = userId;
    json['ore'] = oreName;
    json['amount'] = delta;

    this.socket.emit('incrementOre', json);
  }

  upgradeShipCredit(userId: string, upgradeName: string) {
    const json = {};

    json['user'] = userId;
    json['upgrade'] = upgradeName;

    this.socket.emit('upgradeShipCredit', json);
  }

  upgradeShipOre(userId: string, upgradeName: string) {
    const json = {};

    json['user'] = userId;
    json['upgrade'] = upgradeName;

    this.socket.emit('upgradeShipOre', json);
  }

  updateUpgradeTimer(userId: string, upgradeName: string) {
    const json = {};

    json['user'] = userId;
    json['upgrade'] = upgradeName;

    this.socket.emit('updateUpgradeTimer', json);
  }

  updateCargoTimer(userId: string) {
    const json = {};

    json['user'] = userId;
    this.socket.emit('updateCargoTimer', json);
  }


  sellOre(userId: string, oreName: string, amount: number) {
    const json = {};

    json['user'] = userId;
    json['ore'] = oreName;
    json['amount'] = amount;

    this.socket.emit('sellOre', json);
  }

  buyOre(userId: string, oreName: string, amount: number) {
    const json = {};

    json['user'] = userId;
    json['ore'] = oreName;
    json['amount'] = amount;

    this.socket.emit('buyOre', json);
  }

  searchAsteroid(userId: string, distance: number) {
    const json = {};

    json['user'] = userId;
    json['distance'] = distance;

    this.socket.emit('searchAster', json);
  }

  chooseAsteroid(userId: string, ind: number) {
    const json = {};

    json['user'] = userId;
    json['ind'] = ind;

    this.socket.emit('chooseAsteroid', json);
  }

  updateAsteroidTimer(userId: string) {
    const json = {};

    json['user'] = userId;

    this.socket.emit('updateAsteroidTimer', json);
  }

  rejectResults(userId: string) {
    const json = {};

    json['user'] = userId;

    this.socket.emit('rejectResults', json);
  }

  removeChest(userId: string, numberOfChest: number) {
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

  initializeUser(userId: string, email: string, pseudo: string) {
    const json = {};
    json['user'] = userId;
    json['email'] = email;
    json['pseudo'] = pseudo;
    this.socket.emit('initializeUser', json);
  }

  reachFrenzy(userId: string) {
    const json = {};
    json['user'] = userId;
    this.socket.emit('reachFrenzy', json);
  }
  validArrow(userId: string, keyCode: number, keyInd: number) {
    const json = {};
    json['user'] = userId;
    json['keyCode'] = keyCode;
    json['keyInd'] = keyInd;
    this.socket.emit('validArrow', json);
  }

  badConfigBdd(userId: string, isBadConfig: boolean) {
    const json = {};
    json['user'] = userId;
    json['isBadConfig'] = isBadConfig;
    this.socket.emit('changeBadConfig', json);
  }

  /**
   * Activate the boost of a user
   */
  public activateBoost(userId: string, type: number) {
    this.socket.emit('activateBoost', {
      user: userId,
      type: type
    });
  }
}
