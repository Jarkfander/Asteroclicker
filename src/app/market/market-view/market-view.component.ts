import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ManagedChart } from '../market-list/managedChart';
import { MarketService } from '../market.service';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService } from '../../shared/user/user.service';
import { UpgradeService } from '../../ship/upgrade-list/upgrade.service';
import { OreInfoService } from '../../asteroid/ore-info-view/ore-info.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';


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

  public valuesMultiplicateur: number;
  public valuesTotal: any;
  public boolOreUnlock: boolean;


  constructor(private marketS: MarketService, private socketS: SocketService,
    private userS: UserService, private upgradeS: UpgradeService, private oreInfoS: OreInfoService) {

  }

  ngOnInit() {
      this.boolOreUnlock = this.upgradeS.research[this.userS.currentUser.upgrades[UpgradeType.research].lvl].lvl >=
      this.oreInfoS.getOreInfoByString(this.oreName).lvlOreUnlock;

      this.value = this.marketS.oreCosts[this.oreName]
      [Object.keys(this.marketS.oreCosts[this.oreName])[Object.keys(this.marketS.oreCosts[this.oreName]).length - 1]];

      this.valuesMultiplicateur = this.upgradeS.storage[this.userS.currentUser.upgrades[UpgradeType.storage].lvl].capacity * 0.02
        * this.oreInfoS.getOreInfoByString(this.oreName).miningSpeed;
      this.valuesTotal = this.value * this.valuesMultiplicateur;

      this.recentValues = this.marketS.oreCosts[this.oreName];
      this.histoValues = this.marketS.oreHistory[this.oreName];

      this.marketS.oreCostsSubject[this.oreName].subscribe((tab: number[]) => {
        this.value = tab[Object.keys(tab)[Object.keys(tab).length - 1]];
        this.valuesTotal = this.value * this.valuesMultiplicateur;
        this.recentValues = tab;
      });

      this.marketS.oreHistorySubject[this.oreName].subscribe((tab: number[]) => {
        this.histoValues = tab;
      });

      this.userS.upgradeSubject.subscribe((user) => {
        this.valuesMultiplicateur = this.upgradeS.storage[user.upgrades[UpgradeType.storage].lvl].capacity * 0.02
          * this.oreInfoS.getOreInfoByString(this.oreName).miningSpeed;
        this.valuesTotal = this.value * this.valuesMultiplicateur;
        this.boolOreUnlock = this.upgradeS.research[this.userS.currentUser.upgrades[UpgradeType.research].lvl].lvl >=
        this.oreInfoS.getOreInfoByString(this.oreName).lvlOreUnlock;
  
      });
  }

  public SellOre/*moon*/(amount: number) {
    this.socketS.sellOre(this.oreName, amount);
  }

  public BuyOre(amount: number) {
    this.socketS.buyOre(this.oreName, amount);
  }

  OpenHistory() {
    this.isModalOpen = true;
  }

  CloseHistory() {
    this.isModalOpen = false;
  }
}
