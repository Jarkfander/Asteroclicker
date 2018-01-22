import { Component, OnInit, Input } from '@angular/core';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { SocketService } from '../../shared/socket/socket.service';
import { User, UserUpgrade } from '../../shared/user/user';
import { UserService, IUpgrades, IUpgrade } from '../../shared/user/user.service';
import { Utils } from '../../shared/utils';
import { UpgradeService } from '../upgrade.service';
import { OreService, IOreAmounts, IOreInfos } from '../../ore/ore.service';


@Component({
  selector: 'app-upgrade-view',
  templateUrl: './upgrade-view.component.html',
  styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeViewComponent implements OnInit {

  @Input('UpgradeName') upgradeName: string;

  public upgradeCaraKeys: string[];
  public nextUpgradeCaraKeys: string[];

  public upgradeCurrentLvl: IUpgrade = {
    lvl: 1,
    start: 0,
    timer: 0
  };

  public timer: string = "00:00:00";

  public enableButtonCredit = true;

  public enableButtonOre = true;

  public intervalDone = true;

  public tabOreCost;
  public tabOreCostTemp;

  public upgradeCostString: string[];
  public isOkForBuy = false;

  public userResearchLvl: number = 1;
  oreInfos: IOreInfos;

  public currentOreAmounts: IOreAmounts;
  public currentUsercredit: number;

  @Input('UpgradeLvls') upgradeLvls: Upgrade[];

  constructor(private socketS: SocketService, private userS: UserService,
    private oreS: OreService, private upgradeS: UpgradeService) {
    this.upgradeCurrentLvl = {
      lvl: 1,
      start: 0,
      timer: 0
    };
  }

  ngOnInit() {
    this.oreS.OreInfos.take(1).subscribe((oreInfos: IOreInfos) => {
      this.oreInfos = oreInfos;

      this.userS.getUpgradeByName(this.upgradeName).subscribe((upgrade: IUpgrade) => {
        this.upgradeCurrentLvl = upgrade;
        this.updateData(upgrade);
        const temp = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].costOre;
        this.tabOreCost = this.costOreUpgrade(this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].cost * 0.9,
          this.upgradeLvls[this.upgradeCurrentLvl.lvl].displayName);
        this.valuesUpgradeLvl();
      });

      this.userS.getUpgradeByName('research').subscribe((upgrade: IUpgrade) => {
        this.userResearchLvl = upgrade.lvl;
      });

      setTimeout(() => {
        this.valuesUpgradeLvl();
        this.tabOreCost = this.costOreUpgrade(this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].cost * 0.9,
          this.upgradeLvls[this.upgradeCurrentLvl.lvl].displayName);
        const temp = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].costOre;
      }, 1000);

    });

    this.oreS.OreAmounts.subscribe((oreAmounts: IOreAmounts) => {
      this.currentOreAmounts = oreAmounts;
      this.enableButtonOre = this.boolOreCost();
    });

    this.userS.credit.subscribe((credit: number) => {
      this.currentUsercredit = credit;
      this.enableButtonOre = this.boolOreCost();
    });

    setInterval(() => {
      this.updateTimer();
    }, 1000);

  }

  updateTimer() {
    if (this.upgradeCurrentLvl.start !== 0) {
      this.socketS.updateUpgradeTimer(this.userS.currentUser.uid, this.upgradeLvls[0].name);
    }
    for (let i = 1; i < 5; i++) {
      if (this.userS.currentUser.cargo['cargo' + i] && this.userS.currentUser.cargo['cargo' + i].start !== 0) {
        // this.socketS.updateCargoTimer(this.userS.currentUser.uid);
      }
    }
  }

  updateData(upgrade: IUpgrade) {
    this.upgradeCurrentLvl = upgrade;
    this.timer = Utils.secondsToHHMMSS(upgrade.timer / 1000);
    this.upgradeCaraKeys = Object.keys(this.upgradeLvls[upgrade.lvl].cara);
    this.nextUpgradeCaraKeys = Object.keys(this.upgradeLvls[upgrade.lvl + 1].cara);
  }

  levelUpCredit() {
    this.socketS.upgradeShipCredit(this.userS.currentUser.uid, this.upgradeLvls[this.upgradeCurrentLvl.lvl].name);
  }

  levelUpOre() {
    this.socketS.upgradeShipOre(this.userS.currentUser.uid, this.upgradeLvls[this.upgradeCurrentLvl.lvl].name);
  }

  costOreUpgrade(costCredit: number, nameUpgrade: string) {
    const tempUpgradeName = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].costOre;
    return [this.costOreForCredit(tempUpgradeName[0], costCredit / 2),
    this.costOreForCredit(tempUpgradeName[1], costCredit / 2)];
  }

  costOreForCredit(nameOre: string, costCredit: number) {
    return costCredit / this.oreInfos[nameOre].meanValue;
  }

  valuesUpgradeLvl() {
    const tempUpgradeCost = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].costOreString;
    const keysCost = Object.keys(tempUpgradeCost);
    const oreKeys = Object.keys(this.oreInfos);

    const temp = {};
    for (let i = 0; i < keysCost.length; i++) {
      for (let j = 0; j < oreKeys.length; j++) {
        const tempName = oreKeys[j];
        if (tempName === keysCost[i]) {
          if (this.upgradeS.research[this.userResearchLvl].lvl >=
            this.oreInfos[oreKeys[j]].searchNewOre) {
            temp[oreKeys[j]] = tempUpgradeCost[keysCost[i]];
          } else {
            temp['???'] = tempUpgradeCost[keysCost[i]];
          }
        }

        if (keysCost[i] === 'credit') {
          temp[keysCost[i]] = tempUpgradeCost[keysCost[i]];
        }
      }
    }
    this.upgradeCostString = Object.keys(temp);
  }


  boolOreCost() {
    const tempUpgradeCost = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].costOreString;
    const keysCost = Object.keys(tempUpgradeCost);
    for (let i = 0; i < keysCost.length; i++) {
        if (keysCost[i] === 'credit') {
          if (this.currentUsercredit < tempUpgradeCost[keysCost[i]]) {
            return false;
          }
        }
        if (this.currentOreAmounts[keysCost[i]] < tempUpgradeCost[keysCost[i]]) {
          return false;
        }
    }
    return true;
  }

}
