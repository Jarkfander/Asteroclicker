import { Component } from '@angular/core';
import { UserService } from './user/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private userS:UserService) {}

  public ValiderLogIn(log,pswd){
    this.userS.LogIn(log,pswd);
  }
}
