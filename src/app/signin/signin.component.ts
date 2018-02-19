import { Component } from '@angular/core';
import { UserService } from '../shared/user/user.service';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToasterService } from '../shared/toaster/toaster.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  constructor(private db: AngularFireDatabase,
              private authS : AuthService,
              private toasterS: ToasterService) { }

  public validerLogIn(log: string, pswd: string) {
    this.authS.logIn(log, pswd);
  }

  public createAccount(email: string, pswd: string, pswd2: string, speudo: string, address: string) {
    if (pswd === pswd2) {
      this.authS.createAccount(email, pswd, speudo, address);
    } else {
      this.toasterS.alert('Wrong Password', 'Password confirmation different from the original');
    }
  }
}
