import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { UserService } from '../../user/user.service';
import { ManagedChart } from './managedChart';
import { User } from '../../user/user';
import { OreCosts } from '../oreCosts';
import { MarketService } from '../market.service';


@Component({
  selector: 'app-market-view',
  templateUrl: './market-view.component.html',
  styleUrls: ['./market-view.component.scss']
})
export class MarketViewComponent implements AfterViewInit {
  @ViewChild('carbon') carbonCanvas: ElementRef;
  @ViewChild('titanium') titaniumCanvas: ElementRef;

  public chartCarbon: ManagedChart;
  public chartTitanium: ManagedChart;

  public valuesCreditCarbon: number;
  public valuesCreditTitanium: number;

  constructor(private userS: UserService, private marketS: MarketService) {
    this.valuesCreditCarbon = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[59]];
    this.valuesCreditTitanium = this.marketS.currentOresCosts.titaniumCosts[Object.keys(this.marketS.currentOresCosts.titaniumCosts)[59]];
  }

  ngAfterViewInit() {
    const lineCarbon = this.carbonCanvas.nativeElement.getContext('2d');
    const lineTitanium = this.titaniumCanvas.nativeElement.getContext('2d');
    // draw line chart
    this.chartCarbon = new ManagedChart(lineCarbon, 60, 'rgba(125,125,75,1)');
    this.chartTitanium = new ManagedChart(lineTitanium, 60, 'rgba(175,175,175,1)');

    this.marketS.OreCostsSubject.subscribe((tab: OreCosts) => {
      this.valuesCreditCarbon = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[59]];
      this.chartCarbon.addNew(tab.carbonCosts);

      this.valuesCreditTitanium = this.marketS.currentOresCosts.titaniumCosts[Object.keys(this.marketS.currentOresCosts.titaniumCosts)[59]];
      this.chartTitanium.addNew(tab.titaniumCosts);

      this.valuesCreditCarbon = parseFloat((this.valuesCreditCarbon * 10).toFixed(2));
      this.valuesCreditTitanium = parseFloat((this.valuesCreditTitanium * 10).toFixed(2));
    });

    this.chartCarbon.initTab(this.marketS.currentOresCosts.carbonCosts);
    this.chartTitanium.initTab(this.marketS.currentOresCosts.titaniumCosts);

  }

  public SellOre/*moon*/(amount: number, oreName: string) {
    this.userS.SellOre(amount, oreName);
    this.marketS.UpdateOreTrend(-amount, oreName);
  }

  public BuyOre(amount: number, oreName: string) {
    this.userS.BuyOre(amount, oreName);
    this.marketS.UpdateOreTrend(amount, oreName);
  }
}
