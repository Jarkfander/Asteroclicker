import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ManagedChart } from './managedChart';
import { OreCosts } from '../oreCosts';
import { MarketService } from '../market.service';



@Component({
  selector: 'app-market-list',
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.scss']
})
export class MarketViewComponent implements AfterViewInit {
  
  constructor() {
  }

  ngAfterViewInit() {
  }
}
