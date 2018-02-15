import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ResourcesService } from '../resources/resources.service';
import { IUserBoost } from '../../boost/boost';
import { UserService } from '../user/user.service';


@Injectable()
export class SocketService {

  public userId: string;

  private socket;

  constructor(private resourceS: ResourcesService) {
    this.socket = io(environment.socketUrl);
  }

  openSocket(userId: string) {

    this.userId = userId;
    

    this.socket.on('sendResources', (message) => {
      this.resourceS.FillAll(message);
    });

    this.socket.emit('authentify', userId);

  }

  loadResources(toExecute) {
    this.socket.emit('loadResources', toExecute);
  }

  breakIntoCollectible(delta: number) {
    const json = {};

    json['user'] = this.userId;
    json['amount'] = delta;

    this.socket.emit('breakIntoCollectible', json);
  }

  updateClickGauge( numberOfClick: number) {
    const json = {};

    json['user'] = this.userId;
    json['amount'] = numberOfClick;

    this.socket.emit('updateClickGauge', json);
  }

  pickUpCollectible(oreName: string, delta: number) {
    const json = {};

    json['user'] = this.userId;
    json['ore'] = oreName;
    json['amount'] = delta;

    this.socket.emit('pickUpCollectible', json);
  }

  upgradeShipCredit(upgradeName: string) {
    const json = {};

    json['user'] = this.userId;
    json['upgrade'] = upgradeName;

    this.socket.emit('upgradeShipCredit', json);
  }

  upgradeShipOre(upgradeName: string) {
    const json = {};

    json['user'] = this.userId;
    json['upgrade'] = upgradeName;
    
    this.socket.emit('upgradeShipOre', json);
  }

  updateUpgradeTimer(upgradeName: string) {
    const json = {};

    json['user'] = this.userId;
    json['upgrade'] = upgradeName;

    this.socket.emit('updateUpgradeTimer', json);
  }

  updateCargoTimer() {
    const json = {};

    json['user'] = this.userId;
    this.socket.emit('updateCargoTimer', json);
  }


  sellOre(oreName: string, amount: number) {
    const json = {};

    json['user'] = this.userId;
    json['ore'] = oreName;
    json['amount'] = amount;

    this.socket.emit('sellOre', json);
  }

  buyOre(oreName: string, amount: number) {
    const json = {};

    json['user'] = this.userId;
    json['ore'] = oreName;
    json['amount'] = amount;

    this.socket.emit('buyOre', json);
  }

  searchAsteroid(distance: number) {
    const json = {};

    json['user'] = this.userId;
    json['distance'] = distance;

    this.socket.emit('searchAster', json);
  }

  chooseAsteroid(ind: number) {
    const json = {};

    json['user'] = this.userId;
    json['ind'] = ind;

    this.socket.emit('chooseAsteroid', json);
  }

  updateAsteroidTimer() {
    const json = {};

    json['user'] = this.userId;

    this.socket.emit('updateAsteroidTimer', json);
  }

  rejectResults() {
    const json = {};

    json['user'] = this.userId;

    this.socket.emit('rejectResults', json);
  }

  removeChest(numberOfChest: number) {
    const json = {};
    json['numberOfChest'] = numberOfChest - 1;
    json['user'] = this.userId;

    this.socket.emit('removeChest', json);
  }

  newChest() {
    const json = {};
    json['userID'] = this.userId;
    this.socket.emit('newChest', json);
  }

  deleteEvent() {
    const json = {};
    json['userID'] = this.userId;
    this.socket.emit('deleteEvent', json);
  }

  initializeUser(userId : string,email: string, pseudo: string) {
    const json = {};
    json['user'] = userId;
    json['email'] = email;
    json['pseudo'] = pseudo;
    this.socket.emit('initializeUser', json);
  }

  reachFrenzy() {
    const json = {};
    json['user'] = this.userId;
    this.socket.emit('reachFrenzy', json);
  }
  validArrow(keyCode: number, keyInd: number) {
    const json = {};
    json['user'] = this.userId;
    json['keyCode'] = keyCode;
    json['keyInd'] = keyInd;
    this.socket.emit('validArrow', json);
  }

  badConfigBdd(isBadConfig: boolean) {
    const json = {};
    json['user'] = this.userId;
    json['isBadConfig'] = isBadConfig;
    this.socket.emit('changeBadConfig', json);
  }

  /**
   * Activate the boost of a user
   */
  public activateBoost(type: number) {
    this.socket.emit('activateBoost', {
      user: this.userId,
      type: type
    });
  }

  public upsertUserBoosts() {
    this.socket.emit('upsertUserBoosts', {
      user: this.userId
    });
  }
}
