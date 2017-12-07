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

  public value: number;
  public isModalOpen: boolean = false;
  public recentValues: number[];
  public histoValues: number[];

  constructor(private marketS: MarketService, private socketS: SocketService) {

  }

  ngOnInit() {

    this.value = this.marketS.oreCosts[this.oreName]
    [Object.keys(this.marketS.oreCosts[this.oreName])[29]];

    this.marketS.oreCostsSubject[this.oreName].subscribe((tab: number[]) => {
      this.value = tab[Object.keys(tab)[29]];
      this.recentValues=tab;
    });

    this.marketS.oreHistorySubject[this.oreName].subscribe((tab: number[]) => {
      this.histoValues=tab;
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
