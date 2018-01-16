import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../shared/user/user.service';
import { SocketService } from '../shared/socket/socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements AfterViewInit {

  isBadConfig = false;
  constructor(private userS: UserService, private socketS: SocketService) {
    this.isBadConfig = this.userS.currentUser.boolBadConfig;
  }

  ngAfterViewInit() {
  }

  toggleVisibility(e) {
    this.isBadConfig = e.target.checked;
    this.socketS.badConfigBdd(this.userS.currentUser.uid, this.isBadConfig);
  }

}
