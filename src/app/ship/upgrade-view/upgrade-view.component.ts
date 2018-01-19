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

  public upgradeCurrentLvl: IUpgrade ={
    lvl:1,
    start:0,
    timer:0
  };

  public timer: string = "00:00:00";

  public enableButtonCredit = true;

  public enableButtonOre = true;

  public intervalDone = true;

  public tabOreCost;
  public tabOreCostTemp;

  public userResearchLvl:number=1;
  oreInfos: IOreInfos;

  @Input('UpgradeLvls') upgradeLvls: Upgrade[];

  constructor(private socketS: SocketService, private userS: UserService,
    private oreS: OreService, private upgradeS: UpgradeService) {
      this.upgradeCurrentLvl={
        lvl:1,
        start:0,
        timer:0
      };
  }

  ngOnInit() {
    this.oreS.OreInfos.take(1).subscribe((oreInfos: IOreInfos) => {
      this.oreInfos = oreInfos;

      this.userS.getUpgradeByName(this.upgradeName).subscribe((upgrade: IUpgrade) => {
        this.upgradeCurrentLvl=upgrade;
        this.updateData(upgrade);
        const temp = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].costOre;
        this.tabOreCost = this.costOreUpgrade(this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].cost * 0.9,
          this.upgradeLvls[this.upgradeCurrentLvl.lvl].displayName);
        this.tabOreCostTemp = this.createInterogationPointOre();
      });

      this.userS.getUpgradeByName("research").subscribe((upgrade: IUpgrade) => {
        this.userResearchLvl=upgrade.lvl;
      });
      
      setTimeout(() => {
        this.tabOreCostTemp = this.createInterogationPointOre();
        this.tabOreCost = this.costOreUpgrade(this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].cost * 0.9,
          this.upgradeLvls[this.upgradeCurrentLvl.lvl].displayName);
        const temp = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].costOre;
      }, 1000);

    });

    this.userS.credit.subscribe((credit:number)=>{
      this.updateEnable(credit);
    });

    this.tabOreCost = [0, 0];
    this.tabOreCostTemp = ['????', '????'];

    this.userS.credit.subscribe((credit: number) => {
      this.updateEnable(credit);
    });

    this.oreS.OreAmounts.subscribe((oreAmounts: IOreAmounts) => {
      const temp = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].costOre;
      this.enableButtonOre = this.tabOreCost[0] <= oreAmounts[temp[0]] &&
        this.tabOreCost[1] <= oreAmounts[temp[1]];
    });

    setInterval(() => {
      this.updateTimer();
    }, 1000);

  }

  updateEnable(credit: number) {
    this.enableButtonCredit = this.upgradeLvls[this.upgradeCurrentLvl.lvl + 1].cost <= credit;
  }

  updateTimer() {
    if (this.upgradeCurrentLvl.start !== 0) {
      this.socketS.updateUpgradeTimer(this.userS.currentUser.uid, this.upgradeLvls[0].name);
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

  createInterogationPointOre() {
    const temp = new Array<any>();

    const tempUpgrade = this.upgradeLvls[this.upgradeCurrentLvl.lvl].valuesOreForUpgrade(this.upgradeLvls[this.upgradeCurrentLvl.lvl].name);
    const oreKeys = Object.keys(this.oreInfos);
    for (let i = 0; i < oreKeys.length; i++) {
      const tempName = oreKeys[i];
      if (tempUpgrade[0] === tempName || tempUpgrade[1] === tempName) {
        if (this.upgradeS.research[this.userResearchLvl].lvl >=
          this.oreInfos[tempName].lvlOreUnlock) {
          temp.push(tempName);
        } else {
          temp.push('???');
        }
      }

    }
    return [temp[0], temp[1]];
  }
}
