import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';


@Component({
  selector: 'app-upgrade-view',
  templateUrl: './upgrade-view.component.html',
  styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeViewComponent implements AfterViewInit {

  public user: User;
  constructor(private el: ElementRef, private render: Renderer2, private userS: UserService) { }

  ngAfterViewInit() {


    this.userS.userSubject.subscribe( (user: User) => {
        this.user = user;
    });
  }

}
