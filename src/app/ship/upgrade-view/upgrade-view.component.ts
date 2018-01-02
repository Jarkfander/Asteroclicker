import { Component, OnInit, Input } from '@angular/core';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { SocketService } from '../../shared/socket/socket.service';
import { User, UserUpgrade } from '../../shared/user/user';
import { UserService } from '../../shared/user/user.service';
import { UpgradeLvls } from '../upgrade-list/upgrade-list.component';
import { Utils } from '../../shared/utils';
import { OreInfoService } from '../../asteroid/ore-info-view/ore-info.service';


@Component({
  selector: 'app-upgrade-view',
  templateUrl: './upgrade-view.component.html',
  styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeInfoComponent implements OnInit {

  public upgradeCaraKeys: string[];
  public nextUpgradeCaraKeys: string[];

  public userUpgrade: UserUpgrade;

  public timer: string = "00:00:00";

  public enableButton: boolean = true;

  @Input('UpgradeLvls') upgradeLvls: UpgradeLvls;

  constructor(private socketS: SocketService, private userS: UserService) {
  }

  ngOnInit() {
    this.updateData(this.userS.currentUser);
    this.updateEnable(this.userS.currentUser.credit);
    this.userS.upgradeSubject.subscribe((user: User) => {
      this.updateData(user);
    });
    this.userS.creditSubject.subscribe((user: User) => {
      this.updateEnable(user.credit);
    });
    setInterval(() => { this.updateTimer(); }, 1000);
  }

  updateEnable(credit: number) {
    this.enableButton = this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].cost < credit;
  }

  updateTimer() {
    if (this.userUpgrade.start !== 0) {
      this.socketS.updateUpgradeTimer(this.upgradeLvls.lvls[0].name);
    }
  }

  updateData(user: User) {
    this.userUpgrade = user.upgrades[this.upgradeLvls.type];
    this.timer = Utils.secondsToHHMMSS(this.userUpgrade.timer / 1000);
    this.upgradeCaraKeys = Object.keys(this.upgradeLvls.lvls[this.userUpgrade.lvl].cara);
    this.nextUpgradeCaraKeys = Object.keys(this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].cara);
    this.upgradeLvls.lvls[this.userUpgrade.lvl].displayName;
  }

  levelUp() {
    this.socketS.upgradeShip(this.upgradeLvls.lvls[this.userUpgrade.lvl].name);
  }

}
