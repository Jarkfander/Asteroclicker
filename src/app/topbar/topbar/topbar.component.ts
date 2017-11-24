import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { QuestService } from '../quest.service';
import { SocketService } from '../../socket/socket.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements AfterViewInit {
  public name:string;
  public isModalOpen: boolean;
  public credit:number;
  constructor(private userS: UserService, private questS: QuestService, private socketS: SocketService) {
    this.name=userS.currentUser.name;
    this.credit = userS.currentUser.credit;
  }

  ngAfterViewInit() {
    this.userS.profileSubject.subscribe((user: User) => {
      this.name = user.name;
    });
    this.userS.creditSubject.subscribe((user: User) => {
      this.credit = user.credit;
    });
    this.socketS.connectionEstablished();
    this.calculeMoneyWithSpace();
  }

  public LogOut() {
    this.userS.LogOut();
  }

  public OpenModal() {
    this.isModalOpen = true;
  }

  public CloseModal() {
    this.isModalOpen = false;
  }

  calculeMoneyWithSpace() {
/*    const creditString = this.userS.currentUser.credit.toString();

    for (let i = 0 ; i < creditString.length ; i++) {
      if (i + 1 % 3 === 0) {
        console.log(creditString.charAt(i));
      }
    }*/
  }
}
