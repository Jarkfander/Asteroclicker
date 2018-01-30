import { mining } from './asteroid-mining.animations';
import { Chart } from 'chart.js';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IFrenzyInfo, UserService, IUserUpgrade } from './../../shared/user/user.service';
import { UpgradeService } from '../../ship/upgrade.service';
import { IAsteroid, AsteroidService } from './../asteroid.service';
import { User } from '../../shared/user/user';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-asteroid-mining',
  templateUrl: './asteroid-mining.component.html',
  styleUrls: ['./asteroid-mining.component.scss'],
  animations: [mining]
})
export class AsteroidMiningComponent implements OnInit, AfterViewInit {

  @ViewChild('chartMining') chartMiningRef: ElementRef;
  @ViewChild('chartCapacity') chartCapacityRef: ElementRef;
  private miningMeter: Chart;
  private capacityMeter: Chart;
  public asteroid$: Observable<IAsteroid>;

  private mineRate: number;
  private baseMineRate = 0;
  private userMineRateLvl: number;

  private progressBarMaxValue = 1;
  public progressBarValue = 1;

  private frenzyTimer = 0;
  private frenzyInfo: IFrenzyInfo = {
    state: 0,
    nextCombos: {}
  };

  public capacityPercent = 0;

  constructor(private userS: UserService,
    private asteroidS: AsteroidService,
    private upgradeS: UpgradeService) {
  }

  ngOnInit() {
    this.asteroid$ = this.asteroidS.asteroid$
      .do((asteroid: IAsteroid) => {
        this.capacityMeter.data.datasets[0].data = [Math.floor(asteroid.currentCapacity)];
        this.capacityMeter.data.datasets[1].data = [Math.floor(asteroid.capacity - asteroid.currentCapacity)];
        this.capacityMeter.update();
      });

    this.userS.frenzyInfo
      .subscribe((fInfo: IFrenzyInfo) => this.frenzyInfo = fInfo);

    this.userS.frenzyTimer
      .subscribe((timer: number) => this.frenzyTimer = timer);

    this.userS.mineRateSubject
      .subscribe(() => this.updateProgressBarValue());

    this.userS.mineRateSubject
      .map((user: User) => user.currentMineRate)
      .subscribe((mineRate: number) => this.mineRate = mineRate);

    this.userS.getUpgradeByName('mineRate').subscribe((upgrade: IUserUpgrade) => {
      this.userMineRateLvl = upgrade.lvl;
      this.baseMineRate = this.upgradeS.mineRate[upgrade.lvl].baseRate;
      this.progressBarMaxValue = this.upgradeS.mineRate[upgrade.lvl].maxRate - this.baseMineRate;
      this.updateProgressBarValue();
    });
    this.updateProgressBarValue();
  }

  ngAfterViewInit() {
    this.setCharts();
  }

  /** Update the progress bar */
  private updateProgressBarValue() {
    if (this.frenzyInfo.state) {
      const frenzyTime = this.upgradeS.mineRate[this.userMineRateLvl].frenzyTime;
      this.progressBarValue = this.frenzyTimer / (frenzyTime * 1000);
    } else {
      this.progressBarValue = this.mineRate - this.baseMineRate > 0 ? this.mineRate - this.baseMineRate : 0;
    }
    this.setMiningRate();
  }


  /** Setup the chart */
  private setCharts() {
    // Circular chart for mining rate
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

    Chart.defaults.global.legend.display = false;
    // Horizontal bar for capacity
    this.capacityMeter = new Chart(this.chartCapacityRef.nativeElement, {
      type: 'horizontalBar',
      data: {
        datasets: [{
          label: 'Remains',
          backgroundColor: ['rgb(200, 100, 100)']
        }, {
          label: 'Total',
          backgroundColor: ['rgb(80, 20, 20)']
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: { display: false },
            ticks: { display: false }
          }],
          yAxes: [{ stacked: true }]
        },
        tooltips: { mode: 'point' }
      }
    });
  }

  /** Set the mining rate on the chart */
  private setMiningRate() {
    if (this.progressBarValue > 0) {
      if (this.frenzyInfo.state) {
        this.miningMeter.data.datasets[0].data = [this.progressBarValue, 1 - this.progressBarValue];
      } else {
        this.miningMeter.data.datasets[0].data = [this.progressBarValue, this.progressBarMaxValue - this.progressBarValue];
      }
      this.miningMeter.update();
    }
  }
}
