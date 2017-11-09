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
  public chart: ManagedChart;
  public valuesCreditCarbon: number;

  constructor(private userS: UserService, private marketS: MarketService) {
    this.valuesCreditCarbon = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[9]];
  }

  ngAfterViewInit() {
    const line = this.carbonCanvas.nativeElement.getContext('2d');
    // draw line chart
    this.chart = new ManagedChart(line, 10);
    this.marketS.OreCostsSubject.subscribe( (tabCarbon: any[]) => {
        this.valuesCreditCarbon = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[9]];
        this.chart.addNew(tabCarbon);
    });
    this.chart.initTab(this.marketS.currentOresCosts.carbonCosts);
  }

  public SellCarbon(num: number) {
    this.userS.SellCarbon(num);
    this.marketS.UpdateCarbonTrend(-num);
  }

  public BuyCarbon(num: number) {
    this.userS.BuyCarbon(num);
    this.marketS.UpdateCarbonTrend(num);
  }
}
