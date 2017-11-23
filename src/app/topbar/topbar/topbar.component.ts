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
  public credit:number;

  public user: User;
  public isModalOpenQuest: boolean;
  public isModalOpenRank: boolean;
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

  }

  public LogOut() {
    this.userS.LogOut();
  }

  public openQuestModal() {
    this.isModalOpenQuest = true;
  }

  public closeQuestModal() {
    this.isModalOpenQuest = false;
  }

  public openRankModal() {
    this.isModalOpenRank = true;
  }

  public closeRankModal() {
    this.isModalOpenRank = false;
  }

}
