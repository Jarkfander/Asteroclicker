import { Component, OnInit, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { SocketService } from '../../shared/socket/socket.service';
import { User, UserUpgrade } from '../../shared/user/user';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { Utils } from '../../shared/utils';
import { UpgradeService } from '../upgrade.service';
import { OreService, IOreAmounts, IOreInfos } from '../../ore/ore.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-upgrade-view',
  templateUrl: './upgrade-view.component.html',
  styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeViewComponent implements OnInit {

  @Input() QGlvl: number;
  @Input() researchLvl: number;
  @Input() oreAmount: IOreAmounts;
  @Input() credit: number;
  @Input() set upgrade(userUpgrade: IUserUpgrade) {
    this.userUpgrade = userUpgrade;
    this.oreInfos = this.oreS.oreInfos;
    this.currentUpgrade = this.upgradeS[userUpgrade.name][userUpgrade.lvl];
    this.nextUpgrade = this.upgradeS[userUpgrade.name][userUpgrade.lvl + 1];
    this.updateCost();
  }

  public userUpgrade: IUserUpgrade;
  public currentUpgrade: Upgrade;
  public nextUpgrade: Upgrade;
  public oreInfos: IOreInfos;
  public upgradeCostString: string[];
  public isHover: boolean;
/*
  public QGlvlMax = 0;
  public timer = '00:00:00';

  public enableButtonCredit = true;

  public enableButtonOre = true;

  public intervalDone = true;

  public upgradeCostString: string[];
  public isOkForBuy = false;

  public currentOreAmounts: IOreAmounts;
  public currentUsercredit = 0;

  public userResearchLvl = 1;
  public oreInfos: IOreInfos;

  public currentLvl: IUserUpgrade = {
    lvl: 1,
    name: '',
    start: 0,
    timer: 0
  };
*/

constructor(private socketS: SocketService,
  private el: ElementRef,
  private renderer: Renderer2,
  private userS: UserService,
  private oreS: OreService,
  private upgradeS: UpgradeService) {
}


  @HostListener('mouseenter', ['$event']) inHover() {
    this.upgradeS.activeUserUpgrade$.next(this.userUpgrade);
    this.isHover = true;
  }
  @HostListener('mouseleave', ['$event']) outHover() {
    this.upgradeS.activeUserUpgrade$.next(null);
    this.isHover = false;
  }


  ngOnInit() {
    this.setTimer();
    this.renderer.setStyle(this.el.nativeElement, 'backgroundImage', `url('../../../assets/upgrade/img/${this.userUpgrade.name}.jpg')`);
    /*
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
  */

  }

  /** Setup timer */
  private setTimer() {
    Observable.interval(1000)
      .filter(() => this.userUpgrade.start !== 0)
      .subscribe(() => this.socketS.updateUpgradeTimer(this.userS.currentUser.uid, this.userUpgrade.name));
    /*
    for (let i = 1; i < 5; i++) {
      if (this.userS.currentUser.cargo['cargo' + i] && this.userS.currentUser.cargo['cargo' + i].start !== 0) {
        this.socketS.updateCargoTimer(this.userS.currentUser.uid);
      }
    }
    */
  }

  /** Update credit of user */
  levelUpCredit() {
    this.socketS.upgradeShipCredit(this.userS.currentUser.uid, this.currentUpgrade.name);
  }

  /** Update ore amount of user */
  levelUpOre() {
    this.socketS.upgradeShipOre(this.userS.currentUser.uid, this.currentUpgrade.name);
  }

  costOreUpgrade(costCredit: number, nameUpgrade: string) {
    const tempname = this.nextUpgrade.costOre;
    return [this.costOreForCredit(tempname[0], costCredit / 2),
    this.costOreForCredit(tempname[1], costCredit / 2)];
  }

  costOreForCredit(nameOre: string, costCredit: number) {
    return costCredit / this.oreInfos[nameOre].meanValue;
  }

  /** Change the cost depending on user's upgrade lvl */
  private updateCost() {
    const tempUpgradeCost = this.nextUpgrade.costOreString;
    const keysCost = Object.keys(tempUpgradeCost);
    const oreKeys = Object.keys(this.oreInfos);

    const temp = {};
    for (let i = 0; i < keysCost.length; i++) {
      for (let j = 0; j < oreKeys.length; j++) {
        const tempName = oreKeys[j];
        if (tempName === keysCost[i]) {
          if (this.upgradeS.research[this.researchLvl].lvl >=
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

  /** Check if user has enough credit && credit to upgrade */
  // TODO : Add notifications
  public canBuy(): boolean {
    const tempUpgradeCost = this.nextUpgrade.costOreString;
    const keysCost = Object.keys(tempUpgradeCost);

    if (this.userUpgrade.lvl + 1 > this.QGlvl) {
      return false;
    }
    for (let i = 0; i < keysCost.length; i++) {
      if (keysCost[i] === 'credit') {
        if (this.credit < tempUpgradeCost[keysCost[i]]) {
          return false;
        }
      }
      if (this.oreAmount[keysCost[i]] < tempUpgradeCost[keysCost[i]]) {
        return false;
      }
    }
    return true;
  }

}
