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

  @ViewChild('canvas') canvas: ElementRef;

  public chart: ManagedChart;
  public value: number;
  public valuesMultiplicateur: number;
  public valuesTotal: any;

  constructor(private marketS: MarketService, private socketS: SocketService,
     private userS: UserService, private upgradeS: UpgradeService, private oreInfoS: OreInfoService) {
  }

  ngOnInit() {

    const line = this.canvas.nativeElement.getContext('2d');
    this.chart = new ManagedChart(line, 30, 'rgba(' + this.color + ')');

    const valueMarket = this.marketS.currentOresCosts.getCostsFromString(this.oreName)
    [Object.keys(this.marketS.currentOresCosts.getCostsFromString(this.oreName))[29]];

    this.value = valueMarket;
    this.valuesMultiplicateur = this.upgradeS.storage[this.userS.currentUser.upgrades[UpgradeType.storage].lvl].capacity * 0.02
                                * this.oreInfoS.oreInfo[this.valuesOreInfo(this.oreName)].miningSpeed;
    this.valuesTotal = this.value * this.valuesMultiplicateur;

    this.subjectOre();

    this.chart.initTab(this.marketS.currentOresCosts.getCostsFromString(this.oreName));
  }

  public SellOre/*moon*/(amount: number) {
    this.socketS.sellOre(this.oreName, amount);
  }

  public BuyOre(amount: number) {
    this.socketS.buyOre(this.oreName, amount);
  }

  public valuesOreInfo(stringName: string) {
    if (stringName === 'carbon') {
      return 0;
    } else if (stringName === 'fer') {
      return 1;
    } else if (stringName === 'titanium') {
      return 2;
    }
  }

  subjectOre() {
    this.marketS.getCostsSubjectFromString(this.oreName).subscribe((tab: number[]) => {
      this.value = this.marketS.currentOresCosts.getCostsFromString(this.oreName)
      [Object.keys(this.marketS.currentOresCosts.getCostsFromString(this.oreName))[29]];
      this.valuesTotal = this.value * this.valuesMultiplicateur;
      this.chart.addNew(tab);
    });

    this.userS.upgradeSubject.subscribe((user) => {
      this.valuesMultiplicateur = this.upgradeS.storage[user.upgrades[UpgradeType.storage].lvl].capacity * 0.02
      * this.oreInfoS.oreInfo[this.valuesOreInfo(this.oreName)].miningSpeed;
      this.valuesTotal = this.value * this.valuesMultiplicateur;
    });
  }

}
