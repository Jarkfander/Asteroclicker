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
  public mineRate: number;

  private clickGauge = 0;
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
    this.userS.frenzyInfo
      .subscribe((fInfo: IFrenzyInfo) => this.frenzyInfo = fInfo);

    this.userS.frenzyTimer
      .subscribe((timer: number) => this.frenzyTimer = timer);

    this.userS.mineRateSubject
      .subscribe(() => this.updateMining());

    this.userS.mineRateSubject
      .map((user: User) => user.currentMineRate)
      .subscribe((mineRate: number) => this.mineRate = mineRate);

    this.userS.miningInfo.subscribe((info: IMiningInfo) => {
      this.clickGauge = info.clickGauge;
      this.updateMining();
    });

    this.updateMining();
  }

  ngAfterViewInit() {
    this.setMiningCharts();
    this.asteroidS.asteroid$
      .do((asteroid: IAsteroid) => this.isEmpty = (asteroid.currentCapacity === 0))
      .subscribe((asteroid: IAsteroid) => this.asteroid = asteroid);
  }

  /** Update the mining rate chart */
  private updateMining() {
   /* if (this.frenzyInfo.state) {
      const frenzyTime = this.resourcesS.mineRate[this.userMineRateLvl].frenzyTime;
      this.progressBarValue = this.frenzyTimer / (frenzyTime * 1000);
    } else {
      this.progressBarValue = this.mineRate - this.baseMineRate > 0 ? this.mineRate - this.baseMineRate : 0;
    }*/
    this.setMiningRate();
  }

  /** Set the mining rate on the chart */
  private setMiningRate() {
    if (this.progressBarValue > 0) {
    /*  if (this.frenzyInfo.state) {
        this.miningMeter.data.datasets[0].data = [this.progressBarValue, 1 - this.progressBarValue];
      } else {*/
        this.miningMeter.data.datasets[0].data = [this.clickGauge, 100-this.clickGauge];
      //}
      this.miningMeter.update();
    }
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
