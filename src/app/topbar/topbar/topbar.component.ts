import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { QuestService } from '../quest.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements AfterViewInit {
  public user: User;
  public isModalOpen: boolean;
  constructor(private userS: UserService, private questS: QuestService) {
      this.user = userS.currentUser;
   }

  ngAfterViewInit() {
    this.userS.userSubject.subscribe( (user: User) => {
      this.user = user;
    });
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
}
