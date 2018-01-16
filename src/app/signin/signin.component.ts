import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user/user.service';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private db: AngularFireDatabase,private authS : AuthService) { }

  ngOnInit() {
  }

  public ValiderLogIn(log, pswd) {
    this.authS.LogIn(log, pswd);
  }

  public CreateAccount(email, pswd, pswd2, speudo) {
    if (pswd === pswd2) {
      this.authS.CreateAccount(email, pswd, speudo);
    } else {
      alert('Password confirmation different from the original');
    }
  }
}
