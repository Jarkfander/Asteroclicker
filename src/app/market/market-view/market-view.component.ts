import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { UserService } from '../../user/user.service';
import { ManagedChart } from './managedChart';
import { User } from '../../user/user';
import { OreCosts } from '../oreCosts';
import { MarketService } from '../market.service';
import { SocketService } from '../../socket/socket.service';


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

  public valuesCreditCarbon10: number;
  public valuesCreditCarbon100: number;
  public valuesCreditTitanium10: number;
  public valuesCreditTitanium100: number;

  constructor(private userS: UserService, private marketS: MarketService, private socketS: SocketService) {
    this.valuesCreditCarbon10 = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[29]];
    this.valuesCreditTitanium10 = this.marketS.currentOresCosts.titaniumCosts[Object.keys(this.marketS.currentOresCosts.titaniumCosts)[29]];

    this.valuesCreditCarbon10 = parseFloat((this.valuesCreditCarbon10 * 10).toFixed(2));
    this.valuesCreditCarbon100 = parseFloat((this.valuesCreditCarbon10 * 10).toFixed(2));
    this.valuesCreditTitanium10 = parseFloat((this.valuesCreditTitanium10 * 10).toFixed(2));
    this.valuesCreditTitanium100 = parseFloat((this.valuesCreditTitanium10 * 10).toFixed(2));
  }

  ngAfterViewInit() {
    const lineCarbon = this.carbonCanvas.nativeElement.getContext('2d');
    const lineTitanium = this.titaniumCanvas.nativeElement.getContext('2d');
    // draw line chart
    this.chartCarbon = new ManagedChart(lineCarbon, 30, 'rgba(125,125,75,1)');
    this.chartTitanium = new ManagedChart(lineTitanium, 30, 'rgba(175,175,175,1)');

    // for update each tick
    this.subjectOre();

    this.chartCarbon.initTab(this.marketS.currentOresCosts.carbonCosts);
    this.chartTitanium.initTab(this.marketS.currentOresCosts.titaniumCosts);

  }

  public SellOre/*moon*/(amount: number, oreName: string) {
    this.socketS.sellOre(oreName, amount);
  }

  public BuyOre(amount: number, oreName: string) {
    this.socketS.buyOre(oreName, amount);
  }

  subjectOre() {
    this.marketS.OreCostsSubjectCarbon.subscribe((tab: number[]) => {
      this.valuesCreditCarbon10 = this.marketS.currentOresCosts.carbonCosts[Object.keys(this.marketS.currentOresCosts.carbonCosts)[29]];
      this.chartCarbon.addNew(tab);

      this.valuesCreditCarbon10 = parseFloat((this.valuesCreditCarbon10 * 10).toFixed(2));
      this.valuesCreditCarbon100 = parseFloat((this.valuesCreditCarbon10 * 10).toFixed(2));
    });

    this.marketS.OreCostsSubjectTitanium.subscribe((tab: number[]) => {
      this.valuesCreditTitanium10 = this.marketS.currentOresCosts.titaniumCosts[Object.keys(
        this.marketS.currentOresCosts.titaniumCosts)[29]];
      this.chartTitanium.addNew(tab);

      this.valuesCreditTitanium10 = parseFloat((this.valuesCreditTitanium10 * 10).toFixed(2));
      this.valuesCreditTitanium100 = parseFloat((this.valuesCreditTitanium10 * 10).toFixed(2));
    });

  }
}
