import { Component, AfterViewInit, ViewChild, ElementRef, Pipe } from '@angular/core';
import { SearchResult } from '../search-result/searchResult';
import { UserService } from '../../shared/user/user.service';
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

  public distance: number;

  public capacity: number;

  public asteroid$: Observable<IAsteroid>;

  public search: SearchResult;

  public timer: string = "00:00:00";

  public isModalOpen: boolean = false;

  public mineRate: number;

  public progressBarMaxValue: number;

  public baseMineRate: number;

  public progressBarValue: number;

  public oreAmounts$: Observable<IOreAmounts>;

  public oreInfosTab: OreInfo[];

  public researchInfo: Research;

  public searchTime: string;

  constructor(private userS: UserService, private asteroidS: AsteroidService, private upgradeS: UpgradeService,
    private socketS: SocketService, private oreInfoS: OreService) {
    this.oreInfosTab = new Array();
  }

  ngOnInit(): void {

    this.oreAmounts$ = this.oreInfoS.OreAmounts;
    this.oreInfoS.OreInfos.take(1).subscribe((oreInfos: IOreInfos) => {

      const oreNames = Object.keys(oreInfos);
      
      for (let i = 0; i < oreNames.length; i++) {
        const info: IOreInfo = oreInfos[oreNames[i]];
        this.oreInfosTab.push(new OreInfo(info.order, oreNames[i], info.maxValue, info.meanValue,
          info.minValue, info.miningSpeed, info.searchNewOre));
      }

    });

    this.capacity = this.upgradeS.storage[this.userS.currentUser.upgrades[UpgradeType.storage].lvl].capacity;

    this.search = this.userS.currentUser.asteroidSearch;

    this.mineRate = this.userS.currentUser.currentMineRate;

    this.baseMineRate = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].baseRate;
    this.progressBarMaxValue = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].maxRate - this.baseMineRate;

    this.updateProgressBarValue();

    this.researchInfo = this.upgradeS.research[this.userS.currentUser.upgrades[UpgradeType.research].lvl];
    this.distance = this.researchInfo.maxDistance / 2;
    this.searchTimeUpdate();

    this.asteroid$ = this.asteroidS.asteroid;
    this.userS.upgradeSubject.subscribe((user: User) => {
      this.capacity = this.upgradeS.storage[this.userS.currentUser.upgrades[UpgradeType.storage].lvl].capacity;
      this.baseMineRate = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].baseRate;
      this.progressBarMaxValue = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].maxRate
        - this.baseMineRate;
      this.updateProgressBarValue();
      this.researchInfo = this.upgradeS.research[this.userS.currentUser.upgrades[UpgradeType.research].lvl];
    });
    this.userS.searchSubject.subscribe((user: User) => {
      this.search = user.asteroidSearch;
      this.timer = Utils.secondsToHHMMSS(this.search.timer / 1000);
      if (user.asteroidSearch.results.length !== 3) {
        this.isModalOpen = false;
      }
    });
    this.userS.mineRateSubject.subscribe((user: User) => {
      this.mineRate = user.currentMineRate;
      this.updateProgressBarValue();
    });


    setInterval(() => { this.updateTimer(); }, 1000);

  }

  updateTimer() {
    if (this.search.start !== 0) {
      if (this.search.results.length === 0 || this.search.results.length === 1) {
        this.socketS.updateAsteroidTimer(this.userS.currentUser.uid, this.distance);
      }
    }
  }

  updateProgressBarValue() {
    if (this.userS.currentUser.frenzy.state) {
      const frenzyTime = this.upgradeS.mineRate[this.userS.currentUser.upgrades[UpgradeType.mineRate].lvl].frenzyTime;
      this.progressBarValue = this.userS.currentUser.frenzy.timer / (frenzyTime * 1000);
    }
    else {
      this.progressBarValue = this.mineRate - this.baseMineRate > 0 ? this.mineRate - this.baseMineRate : 0;
      this.progressBarValue /= this.progressBarMaxValue;
    }
  }

  searchTimeUpdate() {
    const coefDist = (((this.distance - this.researchInfo.minDistance) /
      (this.researchInfo.maxDistance - this.researchInfo.minDistance)) * 5) + 1;
    this.searchTime = Utils.secondsToHHMMSS((this.researchInfo.searchTime) * coefDist);
  }

  searchNewAster() {
    this.socketS.searchAsteroid(this.userS.currentUser.uid);
  }

  rejectResults() {
    this.socketS.rejectResults(this.userS.currentUser.uid);
  }

  showResult() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
