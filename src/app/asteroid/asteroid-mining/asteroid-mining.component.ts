import { Chart } from 'chart.js';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IFrenzyInfo, UserService, IUserUpgrade, IMiningInfo } from './../../shared/user/user.service';

import { IAsteroid, AsteroidService } from './../asteroid.service';
import { User } from '../../shared/user/user';
import { Observable } from 'rxjs/Observable';
import { figuesChange } from './../../shared/animations';
import { ResourcesService } from '../../shared/resources/resources.service';

@Component({
  selector: 'app-asteroid-mining',
  templateUrl: './asteroid-mining.component.html',
  styleUrls: ['./asteroid-mining.component.scss'],
  animations: [figuesChange]
})
export class AsteroidMiningComponent implements OnInit, AfterViewInit {

  @ViewChild('chartMining') chartMiningRef: ElementRef;
  private miningMeter: Chart;
  public asteroid: IAsteroid;
  public isEmpty: boolean;

  public clickGauge = 0;
  private progressBarMaxValue: number;
  public progressBarValue: number;

  private frenzyTimer = 0;
  private frenzyInfo: IFrenzyInfo = {
    state: 0,
    nextCombos: {}
  };


  constructor(private userS: UserService,
    private asteroidS: AsteroidService,
    private resourcesS: ResourcesService) {
  }

  ngOnInit() {
    this.setMiningCharts();

    this.userS.frenzyInfo
      .subscribe((fInfo: IFrenzyInfo) => this.frenzyInfo = fInfo);

    this.userS.frenzyTimer
      .subscribe((timer: number) => this.frenzyTimer = timer);

    this.userS.miningInfo.subscribe((info: IMiningInfo) => {
      this.clickGauge = info.clickGauge;
      this.setMiningRate();
    });

    this.setMiningRate();
  }

  ngAfterViewInit() {
    this.asteroidS.asteroid$
      .do((asteroid: IAsteroid) => this.isEmpty = (asteroid.currentCapacity === 0))
      .subscribe((asteroid: IAsteroid) => this.asteroid = asteroid);
  }


  /** Set the mining rate on the chart */
  private setMiningRate() {
    this.miningMeter.data.datasets[0].data = [this.clickGauge, 100 - this.clickGauge];
    this.miningMeter.update();
  }

  /** Setup the mining chart */
  private setMiningCharts() {
    this.miningMeter = new Chart(this.chartMiningRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['mine rate', 'mine rate'],
        datasets: [{
          data: [0, 1],
          backgroundColor: ['rgb(73, 141, 230)', 'rgb(30, 30, 100)'],
          borderColor: ['rgb(190,190,190)', 'rgb(80, 80, 80)']
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: { enabled: false },
      }
    });
  }

}
