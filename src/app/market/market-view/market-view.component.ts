import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ManagedChart } from '../market-list/managedChart';
import { MarketService } from '../market.service';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { SharedModule } from '../../shared/shared.module';
import { UpgradeService } from '../../ship/upgrade.service';
import { OreService } from '../../ore/ore.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { CurveViewComponent } from '../curve-view/curve-view.component';
import { ResourcesService } from '../../shared/resources/resources.service';

@Component({
  selector: 'app-market-view',
  templateUrl: './market-view.component.html',
  styleUrls: ['./market-view.component.scss']
})
export class MarketViewComponent implements OnInit {

  @Input('oreName') oreName: string;
  @Input('color') color: string;

  @ViewChild('currentCostView') currentCostView: CurveViewComponent;

  public value: number;

  public isModalOpen = false;
  public recentValues: number[];
  public histoValues: number[];

  public unitValue: string;
  public valuesTotal: any;
  public valuesTotalWithTaxe: any;

  public hasMoney: boolean;
  public hasOreLeft: boolean;
  public hasSpaceLeft: boolean;

  public maxSliderValue: number;
  public amountToSell = 1;

  public currentOreAmount = 0;

  public userStorageLvl = 1;

  credit: number;

  // Utiliser oreservcie pour recup bystring
  constructor(private marketS: MarketService,
    private socketS: SocketService,
    private userS: UserService,
    private resourcesS: ResourcesService,
    private oreS: OreService) {

  }

  ngOnInit() {



    this.oreS.getOreAmountByString(this.oreName).subscribe((oreAmount: number) => {
      this.hasOreLeft = oreAmount > 0;
      this.hasSpaceLeft = oreAmount
        < this.resourcesS.storage[this.userStorageLvl].capacity;
    });

    this.userS.credit.subscribe((credit: number) => {
      this.credit = credit;
      this.hasMoney = credit > 0;
    });

    this.userS.getUpgradeByName('storage').subscribe((upgrade: IUserUpgrade) => {

      this.hasSpaceLeft = this.currentOreAmount
        < this.resourcesS.storage[this.userStorageLvl].capacity;

      this.userStorageLvl = upgrade.lvl;
      this.maxSliderValue = (this.resourcesS.storage[upgrade.lvl].capacity * 0.02
        * this.resourcesS.oreInfos[this.oreName].miningSpeed);
      this.maxSliderValue = ((Math.floor(this.maxSliderValue / 50)) + 1) * 50;

      this.valuesTotal = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell);
      this.valuesTotalWithTaxe = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell * 1.025);

      this.amountToSell = this.maxSliderValue / 2;
    });

    this.marketS.currentCostsSubject[this.oreName].subscribe((newVal: number) => {
      this.value = newVal;
      this.unitValue = SharedModule.calculeMoneyWithSpace(this.value);

      this.valuesTotal = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell);
      this.valuesTotalWithTaxe = SharedModule.calculeMoneyWithSpace(this.value * this.amountToSell * 1.025);

      this.currentCostView.updateInfo(this.marketS.allCurrentOreCosts[this.oreName]);
    });

    this.recentValues = this.marketS.allCurrentOreCosts[this.oreName];

    this.marketS.historyCostsSubject[this.oreName].subscribe((newVal: number) => {
      this.histoValues = this.marketS.allHistoryOreCosts[this.oreName];
    });

    this.histoValues = this.marketS.allHistoryOreCosts[this.oreName];
  }

  public SellOre/*moon*/(amount: number) {
    this.socketS.sellOre(this.userS.currentUser.uid, this.oreName, amount);
  }

  public BuyOre(amount: number) {
    this.socketS.buyOre(this.userS.currentUser.uid, this.oreName, amount);
  }

  public OpenHistory() {
    this.isModalOpen = true;
  }

  public CloseHistory() {
    this.isModalOpen = false;
  }
}
