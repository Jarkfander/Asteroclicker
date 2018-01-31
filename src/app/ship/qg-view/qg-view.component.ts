
import { Upgrade } from './../upgrade-class/upgrade';
import { Component, OnInit, ElementRef, Renderer2, ViewChild, Input } from '@angular/core';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../../shared/socket/socket.service';
import { OreService, IOreAmounts, IOreInfos } from '../../ore/ore.service';
import { UpgradeService } from '../upgrade.service';
import { NgNotifComponent } from '../../shared/ng-notif/ng-notif.component';

@Component({
  selector: 'app-qg-view',
  templateUrl: './qg-view.component.html',
  styleUrls: ['./qg-view.component.scss']
})
export class QgViewComponent implements OnInit {

  @Input() credit: number;
  @Input() oreAmount: IOreAmounts;

  @ViewChild('timer') timerRef: ElementRef;
  @ViewChild(NgNotifComponent) notif: NgNotifComponent;

  public userUpgrade: IUserUpgrade;
  public currentUpgrade: Upgrade;
  public nextUpgrade: Upgrade;
  public oreInfos: IOreInfos;
  public upgradeCostString: string[];

  constructor(private socketS: SocketService,
    private el: ElementRef,
    private renderer: Renderer2,
    private userS: UserService,
    private oreS: OreService,
    private upgradeS: UpgradeService) { }

  ngOnInit() {
    this.oreInfos = this.oreS.oreInfos;

    this.userS.getUpgradeByName('QG')
      .subscribe((userUpgrade) => {
        this.userUpgrade = userUpgrade;
        this.nextUpgrade = this.upgradeS['QG'][userUpgrade.lvl + 1];
        this.updateCost();
        this.setTimer();
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
  }

  /** Update ore amount of user and update timer */
  public levelUpOre() {
    if (this.canBuy()) {
      this.socketS.upgradeShipOre(this.userS.currentUser.uid, this.currentUpgrade.name);
      this.socketS.updateUpgradeTimer(this.userS.currentUser.uid, this.userUpgrade.name);
    }
  }

  /** Check if user has enough credit && credit to upgrade */
  private canBuy(): boolean {
    const tempUpgradeCost = this.nextUpgrade.costOreString;
    const keysCost = Object.keys(tempUpgradeCost);

    for (let i = 0; i < keysCost.length; i++) {
      if (keysCost[i] === 'credit') {
        if (this.credit < tempUpgradeCost[keysCost[i]]) {
          this.notif.alert('Not enough credit', 'You need ' + tempUpgradeCost[keysCost[i]]);
          return false;
        }
      }
      if (!this.oreMiss(keysCost[i])) {
        this.notif.alert('Research should be higher', 'You should upgrade research before');
        return false;
      }
      if (this.oreAmount[keysCost[i]] < tempUpgradeCost[keysCost[i]]) {
        this.notif.alert('Not enouh ' + keysCost[i], 'You need ' + tempUpgradeCost[keysCost[i]]);
        return false;
      }
    }
    return true;
  }

  /**
 * Check if you have a level of research enough to know this ore
 * @param {string} oreName The name of the ore
 */
  oreMiss(oreName: string) {
    const oreKeys = Object.keys(this.oreInfos);
    for (let j = 0; j < oreKeys.length; j++) {
      const tempName = oreKeys[j];
      if (tempName === oreName) {
        if (this.userUpgrade.lvl <
          this.oreInfos[oreKeys[j]].searchNewOre) {
          return false;
        }
      }
    }
    return true;
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
          if (this.userUpgrade.lvl >=
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
}
