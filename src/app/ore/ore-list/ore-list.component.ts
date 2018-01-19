import { Component, AfterViewInit, ViewChild, ElementRef, Pipe } from '@angular/core';

import { UserService, IUpgrades, IFrenzyInfo } from '../../shared/user/user.service';
import { SocketService } from '../../shared/socket/socket.service';
import { User } from '../../shared/user/user';
import { UpgradeType, Upgrade } from '../../ship/upgrade-class/upgrade';
import { Utils } from '../../shared/utils';
import { Research } from '../../ship/upgrade-class/research';
import { UpgradeService } from '../../ship/upgrade.service';
import { Observable } from 'rxjs/Observable';
import { IAsteroid, AsteroidService } from '../../asteroid/asteroid.service';
import { OreInfo } from '../ore-view/oreInfo';
import { OreService, IOreAmounts, IOreInfos, IOreInfo } from '../ore.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Pipe({ name: "sortBy" })
export class SortPipe {
  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a[args] < b[args]) {
        return -1;
      } else if (a[args] > b[args]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

@Component({
  selector: 'app-ore-list',
  templateUrl: './ore-list.component.html',
  styleUrls: ['./ore-list.component.scss']
})

export class OreListComponent implements OnInit {

  public capacity: number = 0;

  public asteroid$: Observable<IAsteroid>;

  public mineRate: number;

  public baseMineRate: number = 0;

  public oreAmounts$: Observable<IOreAmounts>;

  public userMineRateLvl: number;

  public progressBarValue: number = 1;

  public progressBarMaxValue: number = 1;

  public userFrenzyInfo: IFrenzyInfo = {
    state: 0,
    nextCombos: {}
  };

  public userFrenzyTimer: number = 0;

  constructor(private userS: UserService, private asteroidS: AsteroidService, private upgradeS: UpgradeService,
    private socketS: SocketService, private oreInfoS: OreService) {
  }

  ngOnInit(): void {

    this.oreAmounts$ = this.oreInfoS.OreAmounts;

    this.mineRate = this.userS.currentUser.currentMineRate;

    this.updateProgressBarValue();

    this.asteroid$ = this.asteroidS.asteroid;

    this.userS.frenzyInfo.subscribe((fInfo:IFrenzyInfo)=>{
      this.userFrenzyInfo=fInfo;
    });

    this.userS.frenzyTimer.subscribe((timer:number)=>{
      this.userFrenzyTimer=timer;
    });
    
    this.userS.upgrade.subscribe((upgrade: IUpgrades) => {
      this.userMineRateLvl = upgrade.mineRate.lvl;
      this.capacity = this.upgradeS.storage[upgrade.storage.lvl].capacity;
      this.baseMineRate = this.upgradeS.mineRate[upgrade.mineRate.lvl].baseRate;
      this.progressBarMaxValue = this.upgradeS.mineRate[upgrade.mineRate.lvl].maxRate
      - this.baseMineRate;
      this.updateProgressBarValue();

    });

    this.userS.mineRateSubject.subscribe((user: User) => {
      this.mineRate = user.currentMineRate;
      this.updateProgressBarValue();
    });



  }

  updateProgressBarValue() {
    if (this.userFrenzyInfo.state) {
      const frenzyTime = this.upgradeS.mineRate[this.userMineRateLvl].frenzyTime;
      this.progressBarValue = this.userFrenzyTimer / (frenzyTime * 1000);
    }
    else {
      this.progressBarValue = this.mineRate - this.baseMineRate > 0 ? this.mineRate - this.baseMineRate : 0;
      this.progressBarValue /= this.progressBarMaxValue;
    }
  }



}
