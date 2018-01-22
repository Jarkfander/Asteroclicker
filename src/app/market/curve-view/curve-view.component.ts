import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ManagedChart } from '../market-list/managedChart';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-curve-view',
  templateUrl: './curve-view.component.html',
  styleUrls: ['./curve-view.component.scss']
})
export class CurveViewComponent implements OnInit {


  private init = false;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('shadowCanvas') shadow: ElementRef;

  @Input('color') color: string;
  @Input('size') size: number;

  @Input('tab')
  set allowDay(tab: number[]) {
    if (!this.init) {
      const line = this.canvas.nativeElement.getContext('2d');
      this.chart = new ManagedChart(line, this.size, 'rgba(' + this.color + ')');
      this.chart.myChart.data.datasets[0].borderWidth = 4;
      this.chart.initTab(tab);
      this.init = true;

      // TODO : Factoriser le code avec les 2 courbes
      const shadowLine = this.shadow.nativeElement.getContext('2d');
      this.shadowChart = new ManagedChart(shadowLine, this.size, 'rgba(255, 255, 255, 1)');
      this.shadowChart.initTab(tab);
    } else {
      this.chart.addNew(tab);
    }
  }

  public chart: ManagedChart;
  public shadowChart: ManagedChart;

  constructor() { }

  ngOnInit() {

  }

}
