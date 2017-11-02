import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private userS:UserService) { }

  ngOnInit() {
  }

  public ValiderLogIn(log,pswd){
    this.userS.LogIn(log,pswd);
  }
}
