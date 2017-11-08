import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
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
  public chart: ManagedChart;
  public valuesCreditCarbon: number;

  constructor(private userS: UserService, private marketS: MarketService) {
    this.chart = new ManagedChart();

    this.marketS.OreCostsSubject.subscribe( (tabCarbon: any[]) => {
      delete this.chart;
      this.chart = new ManagedChart();
      this.valuesCreditCarbon = marketS.currentOresCosts.carbonCosts[Object.keys(marketS.currentOresCosts.carbonCosts)[9]];
      this.chart.initTab(tabCarbon);
    });
    this.chart.initTab(marketS.currentOresCosts.carbonCosts);
    this.valuesCreditCarbon = marketS.currentOresCosts.carbonCosts[Object.keys(marketS.currentOresCosts.carbonCosts)[9]];
 }

  ngAfterViewInit() {

  }

  public SellCarbon() {
    this.userS.SellCarbon(10);
    this.marketS.UpdateCarbonTrend(10);
  }

  public BuyCarbon() {
    this.userS.BuyCarbon();
    this.marketS.UpdateCarbonTrend(-10);
  }

}
