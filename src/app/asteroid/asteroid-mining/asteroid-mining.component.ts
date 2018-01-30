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


    this.asteroidS.asteroid$.subscribe((asteroid: IAsteroid) => {
      this.asteroid$ = this.asteroidS.asteroid$;
      this.capacityPercent = parseFloat(((asteroid.currentCapacity * 100) / asteroid.capacity).toFixed(2));
      this.capacityMeter.data.datasets[0].data = [this.capacityPercent + 20];
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
          backgroundColor: ['rgba(255, 99, 132)'],
        }]
      },
      options : {
        maintainAspectRatio : false,
        legend: { display: false }
      }
    });

    // Horizontal bar for capacity
    this.capacityMeter = new Chart(this.chartCapacityRef.nativeElement, {
      type: 'horizontalBar',
      data: {
        datasets: [{
          data: [10],
          backgroundColor: ['rgba(10, 10,10)'],
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{
            ticks: { min: 0, max: 100 },
            gridLines: { display: false }
          }]
        }
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
