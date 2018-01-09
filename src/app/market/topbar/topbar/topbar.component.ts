import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { QuestService } from '../quest.service';
import { UserService } from '../../../shared/user/user.service';
import { User } from '../../../shared/user/user';
import { SocketService } from '../../../shared/socket/socket.service';
import { SharedModule } from '../../../shared/shared.module';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements AfterViewInit {
  public name: string;
  public credit: number;

  public isModalOpenQuest: boolean;
  public isModalOpenRank: boolean;
  public creditValue: string;

  constructor(public userS: UserService, public questS: QuestService, private socketS: SocketService) {
    this.name = userS.currentUser.name;
    this.credit = userS.currentUser.credit;
    this.creditValue = SharedModule.calculeMoneyWithSpace(userS.currentUser.credit);
  }

  ngAfterViewInit() {
    this.userS.profileSubject.subscribe((user: User) => {
      this.name = user.name;
    });
    this.userS.creditSubject.subscribe((user: User) => {
      this.credit = user.credit;
      this.creditValue = SharedModule.calculeMoneyWithSpace(user.credit);
    });
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
