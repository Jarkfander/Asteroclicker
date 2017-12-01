import { Component, OnInit, Input } from '@angular/core';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { SocketService } from '../../shared/socket/socket.service';
import { User } from '../../shared/user/user';
import { UserService } from '../../shared/user/user.service';
import { UpgradeLvls } from '../upgrade-list/upgrade-list.component';


@Component({
  selector: 'app-upgrade-view',
  templateUrl: './upgrade-view.component.html',
  styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeInfoComponent implements OnInit {

  private upgradeCaraKeys: string[];
  private nextupgradeCaraKeys: string[];

  public userUpgradeLvl: number = 0;

  @Input("UpgradeLvls") upgradeLvls: UpgradeLvls;

  constructor(private socketS: SocketService, private userS: UserService) {
  }

  ngOnInit() {
    this.updateData(this.userS.currentUser);
    this.userS.upgradeSubject.subscribe((user: User) => {
      this.updateData(user);
    });
  }

  updateData(user: User) {
    this.userUpgradeLvl = user.upgradesLvl[this.upgradeLvls.type];
    this.upgradeCaraKeys = Object.keys(this.upgradeLvls.lvls[this.userUpgradeLvl].cara);
    this.nextupgradeCaraKeys = Object.keys(this.upgradeLvls.lvls[this.userUpgradeLvl + 1].cara);
    this.upgradeLvls.lvls[this.userUpgradeLvl].displayName;
  }

  levelUp() {
    this.socketS.upgradeShip(this.upgradeLvls.lvls[this.userUpgradeLvl].name);
  }

}
