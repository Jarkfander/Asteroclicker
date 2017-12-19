import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Asteroid } from '../asteroid-view/asteroid';
import { SearchResult } from '../search-result/searchResult';
import { OreInfo } from '../ore-info-view/oreInfo';
import { UserService } from '../../shared/user/user.service';
import { SocketService } from '../../shared/socket/socket.service';
import { OreInfoService } from '../ore-info-view/ore-info.service';
import { UpgradeService } from '../../ship/upgrade-list/upgrade.service';
import { User } from '../../shared/user/user';
import { UpgradeType, Upgrade } from '../../ship/upgrade-class/upgrade';
import { Utils } from '../../shared/utils';
import { Research } from '../../ship/upgrade-class/research';


@Component({
  selector: 'app-infos-list',
  templateUrl: './infos-list.component.html',
  styleUrls: ['./infos-list.component.scss']
})


export class InfosViewComponent implements AfterViewInit {

  public distance: number;

  public capacity: number;

  public asteroid: Asteroid;

  public search: SearchResult;

  public timer: string = "00:00:00";

  public isModalOpen: boolean = false;

  public mineRate;

  public oreAmount: JSON;

  public allOreInfo: OreInfo[];

  public researchInfo: Research;

  public searchTime: string;

  constructor(private userS: UserService, private upgradeS: UpgradeService,
    private socketS: SocketService, private oreInfoS: OreInfoService) {
    this.oreAmount = userS.currentUser.oreAmounts;
    this.capacity = upgradeS.storage[userS.currentUser.upgrades[UpgradeType.storage].lvl].capacity;

    this.asteroid = userS.currentUser.asteroid;

    this.search = userS.currentUser.asteroidSearch;

    this.mineRate = userS.currentUser.currentMineRate;

    this.allOreInfo = oreInfoS.oreInfo;

    this.researchInfo=upgradeS.research[userS.currentUser.upgrades[UpgradeType.research].lvl];
    this.distance = this.researchInfo.maxDistance / 2;
    this.searchTimeUpdate();
  }

  ngAfterViewInit() {
    this.userS.oreSubject.subscribe((user: User) => {
      this.oreAmount = user.oreAmounts;

      //this.carbonOverload = user.carbon >= this.upgradeS.storage[this.storageLvl].capacity;

    });
    this.userS.asteroidSubject.subscribe((user: User) => {
      this.asteroid = user.asteroid;
    });
    this.userS.upgradeSubject.subscribe((user: User) => {
      this.capacity = this.upgradeS.storage[this.userS.currentUser.upgrades[UpgradeType.storage].lvl].capacity;

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
    });


    setInterval(() => { this.updateTimer(); }, 1000);
  }

  updateTimer() {
    if (this.search.start != 0) {
      if (this.search.results.length == 0 || this.search.results.length == 1) {
        this.socketS.updateAsteroidTimer(this.distance);
      }
    }
  }

  //const coefDist = (((message.distance - minDist) / (maxDist - minDist)) * 5) + 1;
  //let timer = ((researchUpgrade[user.val().upgrade.research.lvl].searchTime) * coefDist * 1000)-(Date.now() - user.val().search.start);

  searchTimeUpdate() {
    const coefDist = (((this.distance - this.researchInfo.minDistance) / (this.researchInfo.maxDistance - this.researchInfo.minDistance)) * 5) + 1;
    this.searchTime = Utils.secondsToHHMMSS((this.researchInfo.searchTime) * coefDist);
  }

  searchNewAster() {
    this.socketS.searchAsteroid();
  }

  rejectResults() {
    this.socketS.rejectResults();
  }

  showResult() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
