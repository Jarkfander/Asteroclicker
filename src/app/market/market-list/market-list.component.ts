import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ManagedChart } from './managedChart';
import { MarketService } from '../market.service';
import { OreService, IOreInfos, IOreAmounts } from '../../ore/ore.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/do";

@Component({
  selector: 'app-market-list',
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.scss']
})
export class MarketViewComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
