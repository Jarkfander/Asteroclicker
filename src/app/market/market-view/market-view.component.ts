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
    this.valuesCreditCarbon = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[59]];
  }

  ngAfterViewInit() {
    const line = this.carbonCanvas.nativeElement.getContext('2d');
    // draw line chart
    this.chart = new ManagedChart(line, 60);
    this.marketS.OreCostsSubject.subscribe( (tabCarbon: any[]) => {
        this.valuesCreditCarbon = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[59]];
        this.chart.addNew(tabCarbon);
    });
    this.chart.initTab(this.marketS.currentOresCosts.carbonCosts);
  }

  public SellOre/*moon*/(amount: number,oreName:string) {
    this.userS.SellOre(amount,oreName);
    this.marketS.UpdateOreTrend(-amount,oreName);
  }

  public BuyOre(amount: number,oreName:string) {
    this.userS.BuyOre(amount,oreName);
    this.marketS.UpdateOreTrend(amount,oreName);
  }
}
