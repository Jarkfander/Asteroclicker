import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ManagedChart } from '../market-list/managedChart';
import { MarketService } from '../market.service';
import { SocketService } from '../../shared/socket/socket.service';


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

  constructor(private marketS: MarketService, private socketS: SocketService) {
    
  }

  ngOnInit() {

    const line = this.canvas.nativeElement.getContext('2d');
    this.chart = new ManagedChart(line, 30, 'rgba('+this.color+')');

    this.value = this.marketS.currentOresCosts.getCostsFromString(this.oreName)
    [Object.keys(this.marketS.currentOresCosts.getCostsFromString(this.oreName))[29]];

    this.subjectOre();

    this.chart.initTab(this.marketS.currentOresCosts.getCostsFromString(this.oreName));
  }

  public SellOre/*moon*/(amount: number) {
    this.socketS.sellOre(this.oreName, amount);
  }

  public BuyOre(amount: number) {
    this.socketS.buyOre(this.oreName, amount);
  }

  subjectOre() {
    this.marketS.getCostsSubjectFromString(this.oreName).subscribe((tab: number[]) => {
      this.value = this.marketS.currentOresCosts.getCostsFromString(this.oreName)
      [Object.keys(this.marketS.currentOresCosts.getCostsFromString(this.oreName))[29]];
      this.chart.addNew(tab);
    });
  }

}
