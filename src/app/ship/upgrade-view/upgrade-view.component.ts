import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { SocketService } from '../../shared/socket/socket.service';
import { User, UserUpgrade } from '../../shared/user/user';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { Utils } from '../../shared/utils';
import { UpgradeService } from '../upgrade.service';
import { OreService, IOreAmounts, IOreInfos } from '../../ore/ore.service';


@Component({
  selector: 'app-upgrade-view',
  templateUrl: './upgrade-view.component.html',
  styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeViewComponent implements OnInit {

  @Input() name: string;
  @Input() lvls: Upgrade[];

  public isHover: boolean;

  public QGlvlMax: number = 0;
  public timer: string = "00:00:00";

  public enableButtonCredit = true;

  public enableButtonOre = true;

  public intervalDone = true;

  public upgradeCostString: string[];
  public isOkForBuy = false;

  public currentOreAmounts: IOreAmounts;
  public currentUsercredit = 0;

  public userResearchLvl = 1;
  public oreInfos: IOreInfos;

  public currentLvl: IUserUpgrade ={
    lvl:1,
    name:"",
    start:0,
    timer:0
  };


  constructor(private socketS: SocketService,
    private userS: UserService,
    private oreS: OreService,
    private upgradeS: UpgradeService) {

  }


  @HostListener('mouseenter', ['$event']) inHover() { this.isHover = true; }
  @HostListener('mouseleave', ['$event']) outHover() { this.isHover = false; }

  ngOnInit() {

    this.oreS.OreInfos.take(1).subscribe((oreInfos: IOreInfos) => {
      this.oreInfos = oreInfos;

      this.userS.getUpgradeByName(this.name).subscribe((upgrade: IUserUpgrade) => {
        this.currentLvl = upgrade;
        this.valuesUpgradeLvl();
      });

      this.userS.getUpgradeByName('QG').subscribe((upgrade: IUserUpgrade) => {
        this.QGlvlMax = upgrade.lvl * 10;
      });

      this.userS.getUpgradeByName('research').subscribe((upgrade: IUserUpgrade) => {
        this.userResearchLvl = upgrade.lvl;
        this.valuesUpgradeLvl();
      });

      setTimeout(() => {
        this.valuesUpgradeLvl();
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
    if (this.currentLvl.start !== 0) {
      this.socketS.updateUpgradeTimer(this.userS.currentUser.uid, this.lvls[0].name);
    }
    for (let i = 1; i < 5; i++) {
      if (this.userS.currentUser.cargo['cargo' + i] && this.userS.currentUser.cargo['cargo' + i].start !== 0) {
        this.socketS.updateCargoTimer(this.userS.currentUser.uid);
      }
    }
  }

  levelUpCredit() {
    this.socketS.upgradeShipCredit(this.userS.currentUser.uid, this.lvls[this.currentLvl.lvl].name);
  }

  levelUpOre() {
    this.socketS.upgradeShipOre(this.userS.currentUser.uid, this.lvls[this.currentLvl.lvl].name);
  }

  costOreUpgrade(costCredit: number, nameUpgrade: string) {
    const tempname = this.lvls[this.currentLvl.lvl + 1].costOre;
    return [this.costOreForCredit(tempname[0], costCredit / 2),
    this.costOreForCredit(tempname[1], costCredit / 2)];
  }

  costOreForCredit(nameOre: string, costCredit: number) {
    return costCredit / this.oreInfos[nameOre].meanValue;
  }


  valuesUpgradeLvl() {
    const tempUpgradeCost = this.lvls[this.currentLvl.lvl + 1].costOreString;
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
    const tempUpgradeCost = this.lvls[this.currentLvl.lvl + 1].costOreString;
    const keysCost = Object.keys(tempUpgradeCost);

    if (this.currentLvl.lvl + 1 > this.QGlvlMax) {
      return false;
    }
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
