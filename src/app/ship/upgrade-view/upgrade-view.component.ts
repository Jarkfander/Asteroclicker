import { Component, OnInit, Input } from '@angular/core';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { SocketService } from '../../shared/socket/socket.service';
import { User, UserUpgrade } from '../../shared/user/user';
import { UserService } from '../../shared/user/user.service';
import { UpgradeLvls } from '../upgrade-list/upgrade-list.component';
import { Utils } from '../../shared/utils';
import { OreInfoService } from '../../asteroid/ore-info-view/ore-info.service';
import { UpgradeService } from '../upgrade-list/upgrade.service';


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

  public enableButtonCredit = true;

  public enableButtonOre = true;

  public intervalDone = true;

  public tabOreCost;
  public tabOreCostTemp;

  @Input('UpgradeLvls') upgradeLvls: UpgradeLvls;

  constructor(private socketS: SocketService, private userS: UserService,
    private oreInfoS: OreInfoService, private upgradeS: UpgradeService) {
  }

  ngOnInit() {
    this.updateData(this.userS.currentUser);
    this.updateEnable(this.userS.currentUser.credit);
    this.tabOreCost = [0, 0];
    this.tabOreCostTemp = ['????', '????'];
    this.userS.upgradeSubject.subscribe((user: User) => {
      this.updateData(user);
      const temp = this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].costOre;
      this.enableButtonOre = this.tabOreCost[0] <= this.userS.currentUser.oreAmounts[temp[0]] &&
        this.tabOreCost[1] <= this.userS.currentUser.oreAmounts[temp[1]];
      this.tabOreCost = this.costOreUpgrade(this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].cost * 0.9,
        this.upgradeLvls.lvls[this.userUpgrade.lvl].displayName);
      this.tabOreCostTemp = this.createInterogationPointOre();
    });
    this.userS.creditSubject.subscribe((user: User) => {
      this.updateEnable(user.credit);
    });
    setInterval(() => {
      this.updateTimer();
      if (this.intervalDone) {
        this.intervalDone = false;
        this.tabOreCostTemp = this.createInterogationPointOre();
        this.tabOreCost = this.costOreUpgrade(this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].cost * 0.9,
          this.upgradeLvls.lvls[this.userUpgrade.lvl].displayName);
        const temp = this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].costOre;
        this.enableButtonOre = this.tabOreCost[0] <= this.userS.currentUser.oreAmounts[temp[0]] &&
          this.tabOreCost[1] <= this.userS.currentUser.oreAmounts[temp[1]];
      }
    }, 1000);

  }

  updateEnable(credit: number) {
    this.enableButtonCredit = this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].cost <= credit;
  }

  updateTimer() {
    if (this.userUpgrade.start !== 0) {
      this.socketS.updateUpgradeTimer(this.userS.currentUser.uid,this.upgradeLvls.lvls[0].name);
    }
  }

  updateData(user: User) {
    this.userUpgrade = user.upgrades[this.upgradeLvls.type];
    this.timer = Utils.secondsToHHMMSS(this.userUpgrade.timer / 1000);
    this.upgradeCaraKeys = Object.keys(this.upgradeLvls.lvls[this.userUpgrade.lvl].cara);
    this.nextUpgradeCaraKeys = Object.keys(this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].cara);
  }

  levelUpCredit() {
    this.socketS.upgradeShipCredit(this.userS.currentUser.uid,this.upgradeLvls.lvls[this.userUpgrade.lvl].name);
  }

  levelUpOre() {
    this.socketS.upgradeShipOre(this.userS.currentUser.uid,this.upgradeLvls.lvls[this.userUpgrade.lvl].name);
  }

  costOreUpgrade(costCredit: number, nameUpgrade: string) {
    const tempUpgradeName = this.upgradeLvls.lvls[this.userUpgrade.lvl + 1].costOre;
    return [this.costOreForCredit(tempUpgradeName[0], costCredit / 2),
    this.costOreForCredit(tempUpgradeName[1], costCredit / 2)];
  }

  costOreForCredit(nameOre: string, costCredit: number) {
    return costCredit / this.oreInfoS.getOreInfoByString(nameOre).meanValue;
  }

  createInterogationPointOre() {
    const temp = new Array<any>();

    const tempUpgrade = this.upgradeLvls.lvls[this.userUpgrade.lvl].valuesOreForUpgrade(this.upgradeLvls.lvls[this.userUpgrade.lvl].name);
    for (let i = 0; i < this.oreInfoS.oreInfo.length; i++) {
      const tempName = this.oreInfoS.oreInfo[i].name;
      if (tempUpgrade[0] === tempName || tempUpgrade[1] === tempName) {
        if (this.upgradeS.research[this.userS.currentUser.upgrades[UpgradeType.research].lvl].lvl >=
          this.oreInfoS.oreInfo[i].lvlOreUnlock) {
          temp.push(tempName);
        } else {
          temp.push('???');
        }
      }

    }
    return [temp[0], temp[1]];
  }
}
