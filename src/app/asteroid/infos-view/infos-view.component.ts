import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';

@Component({
  selector: 'app-infos-view',
  templateUrl: './infos-view.component.html',
  styleUrls: ['./infos-view.component.scss']
})
export class InfosViewComponent implements AfterViewInit {
  public user: User;
  public storageOverload: boolean=false;
  constructor( private userS: UserService,private upgradeS: UpgradeService) { 
    this.user = this.userS.currentUser;
    this.storageOverload=this.user.carbon>=this.upgradeS.storage[this.user.storageLvl].capacity;
  }

  ngAfterViewInit() {

    this.userS.userSubject.subscribe( (user: User) => {
      this.user = user;
      this.storageOverload=this.user.carbon>=this.upgradeS.storage[this.user.storageLvl].capacity;
    });
  }

}
