import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ManagedChart } from '../market-list/managedChart';
import { MarketService } from '../market.service';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService } from '../../shared/user/user.service';
import { UpgradeService } from '../../ship/upgrade-list/upgrade.service';
import { OreInfoService } from '../../asteroid/ore-info-view/ore-info.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { SharedModule } from '../../shared/shared.module';


@Component({
  selector: 'app-market-view',
  templateUrl: './market-view.component.html',
  styleUrls: ['./market-view.component.scss']
})
export class MarketInfoComponent implements OnInit {

  @Input('oreName') oreName: string;
  @Input('color') color: string;

  public value: number;

  public isModalOpen: boolean = false;
  public recentValues: number[];
  public histoValues: number[];

  public unitValue: string;
  public valuesTotal: any;
  public valuesTotalWithTaxe: any;
  public boolOreUnlock: boolean;

  public hasMoney: boolean;
  public hasOreLeft: boolean;
  public hasSpaceLeft: boolean;

  public maxSliderValue: number;
  public amount: number;

  constructor(private marketS: MarketService, private socketS: SocketService,
    private userS: UserService, private upgradeS: UpgradeService, private oreInfoS: OreInfoService) {

  }

  ngOnInit() {

    this.hasMoney = this.userS.currentUser.credit > 0;
    this.hasOreLeft = this.userS.currentUser.oreAmounts[this.oreName] > 0;
    this.hasSpaceLeft = this.userS.currentUser.oreAmounts[this.oreName]
      < this.upgradeS.storage[this.userS.currentUser.upgrades[UpgradeType.storage].lvl].capacity;

    this.boolOreUnlock = this.userS.currentUser.upgrades[UpgradeType.research].lvl >=
      this.oreInfoS.getOreInfoByString(this.oreName).lvlOreUnlock;

    this.value = this.marketS.oreCosts[this.oreName]
    [Object.keys(this.marketS.oreCosts[this.oreName])[Object.keys(this.marketS.oreCosts[this.oreName]).length - 1]];

    this.unitValue = SharedModule.calculeMoneyWithSpace(this.value);
    this.maxSliderValue = (this.upgradeS.storage[this.userS.currentUser.upgrades[UpgradeType.storage].lvl].capacity * 0.02
      * this.oreInfoS.getOreInfoByString(this.oreName).miningSpeed);
    this.maxSliderValue = ((Math.floor(this.maxSliderValue / 50)) + 1) * 50

    this.amount = parseFloat((this.maxSliderValue / 2).toFixed(1));

    this.valuesTotal = SharedModule.calculeMoneyWithSpace(this.value * this.amount);
    this.valuesTotalWithTaxe = SharedModule.calculeMoneyWithSpace(this.value * this.amount * 1.025);

    this.recentValues = this.marketS.oreCosts[this.oreName];
    this.histoValues = this.marketS.oreHistory[this.oreName];

    this.marketS.oreCostsSubject[this.oreName].subscribe((tab: number[]) => {
      this.value = tab[Object.keys(tab)[Object.keys(tab).length - 1]];
      this.unitValue = SharedModule.calculeMoneyWithSpace(this.value);
      
      this.valuesTotal = SharedModule.calculeMoneyWithSpace(this.value * this.amount);
      this.valuesTotalWithTaxe = SharedModule.calculeMoneyWithSpace(this.value * this.amount * 1.025);
      this.recentValues = tab;
    });

    this.marketS.oreHistorySubject[this.oreName].subscribe((tab: number[]) => {
      this.histoValues = tab;
    });

    this.userS.upgradeSubject.subscribe((user) => {

      this.maxSliderValue = (this.upgradeS.storage[user.upgrades[UpgradeType.storage].lvl].capacity * 0.02
        * this.oreInfoS.getOreInfoByString(this.oreName).miningSpeed);
      this.maxSliderValue = ((Math.floor(this.maxSliderValue / 50)) + 1) * 50;

      this.valuesTotal = SharedModule.calculeMoneyWithSpace(this.value * this.amount);
      this.valuesTotalWithTaxe = SharedModule.calculeMoneyWithSpace(this.value * this.amount * 1.025);

      this.boolOreUnlock = this.upgradeS.research[this.userS.currentUser.upgrades[UpgradeType.research].lvl].lvl >=
        this.oreInfoS.getOreInfoByString(this.oreName).lvlOreUnlock;
      this.hasSpaceLeft = user.oreAmounts[this.oreName]
        < this.upgradeS.storage[user.upgrades[UpgradeType.storage].lvl].capacity;
    });

    this.userS.creditSubject.subscribe((user) => {
      this.hasMoney = user.credit > 0;
    });

    this.userS.oreSubject.subscribe((user) => {
      this.hasOreLeft = user.oreAmounts[this.oreName] > 0;
      this.hasSpaceLeft = user.oreAmounts[this.oreName]
        < this.upgradeS.storage[user.upgrades[UpgradeType.storage].lvl].capacity;
    });
  }

  public SellOre/*moon*/(amount: number) {
    this.socketS.sellOre(this.userS.currentUser.uid, this.oreName, amount);
  }

  public BuyOre(amount: number) {
    this.socketS.buyOre(this.userS.currentUser.uid, this.oreName, amount);
  }

  OpenHistory() {
    this.isModalOpen = true;
  }

  CloseHistory() {
    this.isModalOpen = false;
  }
}
