import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';


@Injectable()
export class SocketService {

  private url = environment.socketUrl;

  private socket;

  constructor(private userS: UserService) {
    this.socket = io(this.url);
  }

  incrementOre(oreName: string, delta: number) {
    let json = {};

    json["user"] = this.userS.currentUser.uid;
    json["ore"] = oreName;
    json["amount"] = delta;

    this.socket.emit("incrementOre", json);
  }

  upgradeShip(upgradeName: string) {
    let json = {};

    json["user"] = this.userS.currentUser.uid;
    json["upgrade"] = upgradeName;

    this.socket.emit("upgradeShip", json);
  }

  updateUpgradeTimer(upgradeName: string) {
    let json = {};

    json["user"] = this.userS.currentUser.uid;
    json["upgrade"] = upgradeName;

    this.socket.emit("updateUpgradeTimer", json);
  }


  sellOre(oreName: string, amount: number) {
    let json = {};

    json["user"] = this.userS.currentUser.uid;
    json["ore"] = oreName;
    json['amount'] = amount;

    this.socket.emit('sellOre', json);
  }

  buyOre(oreName: string, amount: number) {
    let json = {};

    json['user'] = this.userS.currentUser.uid;
    json['ore'] = oreName;
    json['amount'] = amount;

    this.socket.emit('buyOre', json);
  }

  searchAsteroid() {
    let json = {};

    json['user'] = this.userS.currentUser.uid;

    this.socket.emit('searchAster', json);
  }

  chooseAsteroid(ind : number) {
    let json = {};

    json['user'] = this.userS.currentUser.uid;
    json['ind'] = ind;

    this.socket.emit('chooseAsteroid', json);
  }

  updateAsteroidTimer(distance: number) {
    let json = {};

    json['user'] = this.userS.currentUser.uid;
    json['distance'] = distance;
    console.log(distance);
    this.socket.emit('updateAsteroidTimer', json);
  }

  rejectResults() {
    let json = {};

    json['user'] = this.userS.currentUser.uid;

    this.socket.emit('rejectResults', json);
  }

  connectionEstablished() {
    const json = {};

    json['user'] = this.userS.currentUser.uid;

    this.socket.emit('userLogged', json);
  }

  removeChest() {
    const json = {};
    json['numberOfChest'] = this.userS.currentUser.numberOfChest - 1;
    json['user'] = this.userS.currentUser.uid;

    this.socket.emit('removeChest', json);
  }

  newChest() {
    const json = {};
    json['currentUser'] = this.userS.currentUser;
    json['userID'] = this.userS.currentUser.uid;
    this.socket.emit('newChest', json);
  }

  deleteEvent() {
    const json = {};
    json['userID'] = this.userS.currentUser.uid;
    this.socket.emit('deleteEvent', json);
  }
}
