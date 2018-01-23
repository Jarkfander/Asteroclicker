import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ManagedChart } from '../market-list/managedChart';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-curve-view',
  templateUrl: './curve-view.component.html',
  styleUrls: ['./curve-view.component.scss']
})
export class CurveViewComponent implements OnInit {


  private init: boolean = false;
  @ViewChild('canvas') canvas: ElementRef;

  @Input('color') color: string;
  @Input('size') size: number;

  @Input('tab')
  set allowDay(tab: number[]) {
    if (!this.init) {
      const line = this.canvas.nativeElement.getContext('2d');
      this.chart = new ManagedChart(line, this.size, 'rgba(' + this.color + ')');
      this.chart.initTab(tab);
      this.init=true;
    }
    else {
      this.chart.addNew(tab);
    }
  }

  public chart: ManagedChart;

  constructor() { }

  ngOnInit() {

  }

}
