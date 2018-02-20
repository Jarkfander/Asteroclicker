import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { UserService, IProfile } from '../shared/user/user.service';
import { QuestService } from '../quest/quest.service';
import { SocketService } from '../shared/socket/socket.service';
import { SharedModule } from '../shared/shared.module';
import { User } from '../shared/user/user';
import { AuthService } from '../signin/auth.service';
import { staggerTile } from '../shared/animations';



@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  animations: [staggerTile]
})
export class TopbarComponent implements AfterViewInit {
  public name: string = "";
  public credit: number = 0;

  public isModalQuest: boolean;
  public isModalRank: boolean;
  public isModalProfile: boolean;
  public isModalBoost: boolean;
  public creditValue: string = "";

  constructor(private authS: AuthService, public userS: UserService, public questS: QuestService, private socketS: SocketService) {
  }

  ngAfterViewInit() {
    this.userS.profile.subscribe((profile: IProfile) => {
      this.name = profile.name;
    });
    this.userS.credit.subscribe((credit: number) => {
      this.credit = credit;
      this.creditValue = SharedModule.calculeMoneyWithSpace(credit);
    });
  }

  public LogOut() {
    this.authS.logOut();
  }

  /*
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

  public openProfileModal() {
    this.isModalProfile = true;
  }

  public closeProfileModal() {
    this.isModalProfile = false;
  }
  */
}
