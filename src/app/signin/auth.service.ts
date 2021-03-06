import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { SocketService } from '../shared/socket/socket.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { User } from 'firebase/app';

import 'rxjs/add/operator/map';
import { UserService } from '../shared/user/user.service';

export interface IUser {

}

@Injectable()
export class AuthService {

  private userLogged: boolean = false;

  constructor(private afAuth: AngularFireAuth, private socketS: SocketService, private userS:UserService) { 
    afAuth.authState.subscribe((auth) => {
      if (auth != null) {
        userS.initializeUser(auth.uid);
        socketS.openSocket(auth.uid);
      }
    });
  }

  public logIn(log, pswd) {
    this.afAuth.auth.signInWithEmailAndPassword(log, pswd);
  }

  public createAccount(email, pswd, pseudo, address) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, pswd).then((message) => {
      this.socketS.initializeUser(message.uid,email, pseudo, address);
    });
  }

  public logOut() {
    this.userLogged = false;
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }

  get User(): Observable<User> {
    return this.afAuth.authState;
  }

  get UserId(): Observable<string> {
    return this.afAuth.authState.map((user: User) => user.uid);
  }

  get isAuth(): Observable<boolean> {
    return this.afAuth.authState.map((user: User) => user != null);
  }

}
