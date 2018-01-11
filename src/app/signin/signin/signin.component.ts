import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private userS: UserService) { }

  ngOnInit() {
  }

  public ValiderLogIn(log, pswd) {
    this.userS.LogIn(log, pswd);
  }

  public CreateAccount(email, pswd, pswd2) {
    if (pswd === pswd2) {
      this.userS.CreateAccount(email, pswd);
    } else {
      alert('Password confirmation different from the original');
    }
  }
}
