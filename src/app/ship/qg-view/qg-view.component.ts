
import { Upgrade } from './../upgrade-class/upgrade';
import { Component, OnInit } from '@angular/core';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-qg-view',
  templateUrl: './qg-view.component.html',
  styleUrls: ['./qg-view.component.scss']
})
export class QgViewComponent implements OnInit {

  public userUpgrade: Observable<IUserUpgrade>;
  public currentUpgrade: Observable<Upgrade>;
  public nextUpgrade: Observable<Upgrade>;
  constructor(private userS: UserService) { }

  ngOnInit() {
    this.userUpgrade = this.userS.getUpgradeByName('QG');
  }

}
