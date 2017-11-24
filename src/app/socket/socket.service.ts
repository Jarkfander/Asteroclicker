import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { UserService } from '../user/user.service';


@Injectable()
export class SocketService {

  //private url = 'http://localhost:4000';
  //private url = 'http://192.168.0.252:4000';
  private url = 'http://78.192.54.38:4000';

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

  sellOre(oreName: string, amount: number) {
    let json = {};

    json["user"] = this.userS.currentUser.uid;
    json["ore"] = oreName;
    json["amount"] = amount;

    this.socket.emit("sellOre", json);
  }

  buyOre(oreName: string, amount: number) {
    let json = {};

    json["user"] = this.userS.currentUser.uid;
    json["ore"] = oreName;
    json["amount"] = amount;

    this.socket.emit("buyOre", json);
  }

  searchAsteroid() {
    let json = {};

    json["user"] = this.userS.currentUser.uid;

    this.socket.emit("searchAster", json);
  }

  researchFinished() {
    let json = {};

    json["user"] = this.userS.currentUser.uid;

    this.socket.emit("researchFinished", json);
  }

  chooseAsteroid(ind : number) {
    let json = {};

    json["user"] = this.userS.currentUser.uid;
    json["ind"] = ind;

    this.socket.emit("chooseAsteroid", json);
  }

  arrivedToAsteroid() {
    let json = {};

    json["user"] = this.userS.currentUser.uid;

    this.socket.emit("arrivedToAsteroid", json);
  }

  rejectResults() {
    let json = {};

    json["user"] = this.userS.currentUser.uid;

    this.socket.emit("rejectResults", json);
  }

  connectionEstablished() {
    let json = {};

    json["user"] = this.userS.currentUser.uid;

    this.socket.emit("userLogged", json);
  }


}
