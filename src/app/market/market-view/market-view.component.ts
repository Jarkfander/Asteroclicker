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
  @ViewChild('canvas') canvasEl: ElementRef;
  public chart: ManagedChart;
  public valuesCreditCarbon: number;

  constructor(private userS: UserService, private marketS: MarketService) {
    this.valuesCreditCarbon = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[9]] * 10;
  }

  ngAfterViewInit() {
    const line = this.canvasEl.nativeElement.getContext('2d');
    // draw line chart
    this.chart = new ManagedChart(line, 10);
    this.marketS.OreCostsSubject.subscribe( (tabCarbon: any[]) => {
        this.valuesCreditCarbon = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[9]] * 10;
        this.chart.addNew(tabCarbon);
    });
    this.chart.initTab(this.marketS.currentOresCosts.carbonCosts);
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
