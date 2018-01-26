import { NgNotifComponent } from './../../shared/ng-notif/ng-notif.component';
import { Component, OnInit, Input, HostListener, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { SocketService } from '../../shared/socket/socket.service';
import { User, UserUpgrade } from '../../shared/user/user';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { Utils } from '../../shared/utils';
import { UpgradeService } from '../upgrade.service';
import { OreService, IOreAmounts, IOreInfos } from '../../ore/ore.service';
import { enter } from '../../shared/animations';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-upgrade-view',
  templateUrl: './upgrade-view.component.html',
  styleUrls: ['./upgrade-view.component.scss'],
  animations: [enter]
})
export class UpgradeViewComponent implements OnInit {

  @Input() name: string;
  @Input() QGlvl: number;
  @Input() researchLvl: number;
  @Input() oreAmount: IOreAmounts;
  @Input() credit: number;

  @ViewChild('timer') timerRef: ElementRef;
  @ViewChild(NgNotifComponent) notif: NgNotifComponent;

  public userUpgrade: IUserUpgrade;
  public currentUpgrade: Upgrade;
  public nextUpgrade: Upgrade;
  public oreInfos: IOreInfos;
  public upgradeCostString: string[];
  public isHover: boolean;

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
    this.oreInfos = this.oreS.oreInfos;

    this.userS.getUpgradeByName(this.name)
      .subscribe((userUpgrade) => {
        this.userUpgrade = userUpgrade;
        this.currentUpgrade = this.upgradeS[userUpgrade.name][userUpgrade.lvl];
        this.nextUpgrade = this.upgradeS[userUpgrade.name][userUpgrade.lvl + 1];
        this.updateCost();
        this.setTimer();
        this.renderer.setStyle(this.el.nativeElement, 'backgroundImage', `url('../../../assets/upgrade/img/${this.userUpgrade.name}.jpg')`);
      });
  }

  /** Setup timer if upgrade starts */
  private setTimer() {
    setTimeout(() => {
      if (this.userUpgrade.start !== 0) {
        const timeLeft = 100 - ((this.userUpgrade.timer - this.nextUpgrade.time) / (10 * this.nextUpgrade.time));
        this.renderer.setStyle(this.timerRef.nativeElement, 'transform', `translateY(${timeLeft}%)`);
        this.socketS.updateUpgradeTimer(this.userS.currentUser.uid, this.userUpgrade.name);
      }
    }, 1000);

      /*
    for (let i = 1; i < 5; i++) {
      if (this.userS.currentUser.cargo['cargo' + i] && this.userS.currentUser.cargo['cargo' + i].start !== 0) {
        this.socketS.updateCargoTimer(this.userS.currentUser.uid);
      }
    }
    */
  }

  /** Update credit of user
  levelUpCredit() {
    this.socketS.upgradeShipCredit(this.userS.currentUser.uid, this.currentUpgrade.name);
  } */

  /** Update ore amount of user and update timer */
  public levelUpOre() {
    if (this.canBuy()) {
      this.socketS.upgradeShipOre(this.userS.currentUser.uid, this.currentUpgrade.name);
      this.socketS.updateUpgradeTimer(this.userS.currentUser.uid, this.userUpgrade.name);
    }
  }

  private costOreUpgrade(costCredit: number, nameUpgrade: string) {
    const tempname = this.nextUpgrade.costOre;
    return [this.costOreForCredit(tempname[0], costCredit / 2),
    this.costOreForCredit(tempname[1], costCredit / 2)];
  }

  private costOreForCredit(nameOre: string, costCredit: number) {
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
  private canBuy(): boolean {
    const tempUpgradeCost = this.nextUpgrade.costOreString;
    const keysCost = Object.keys(tempUpgradeCost);

    if (this.userUpgrade.lvl + 1 > this.QGlvl) {
      this.notif.alert('QG Level', 'QG should be higher than ' + this.userUpgrade.lvl + 1);
      return false;
    }
    for (let i = 0; i < keysCost.length; i++) {
      if (keysCost[i] === 'credit') {
        if (this.credit < tempUpgradeCost[keysCost[i]]) {
          this.notif.alert('Not enough credit', 'You need ' + tempUpgradeCost[keysCost[i]]);
          return false;
        }
      }
      if (this.oreAmount[keysCost[i]] < tempUpgradeCost[keysCost[i]]) {
        this.notif.alert('Not enouh ' + keysCost[i], 'You need ' + tempUpgradeCost[keysCost[i]]);
        return false;
      }
    }
    return true;
  }

}
