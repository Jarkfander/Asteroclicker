import { Component, AfterViewInit } from '@angular/core';
import { Asteroid } from '../asteroid-view/asteroid';
import { SearchResult } from '../search-result/SearchResult';
import { OreInfo } from '../ore-info-view/oreInfo';
import { UserService } from '../../shared/user/user.service';
import { SocketService } from '../../shared/socket/socket.service';
import { OreInfoService } from '../ore-info-view/ore-info.service';
import { UpgradeService } from '../../ship/upgrade-list/upgrade.service';
import { User } from '../../shared/user/user';


@Component({
  selector: 'app-infos-list',
  templateUrl: './infos-list.component.html',
  styleUrls: ['./infos-list.component.scss']
})
export class InfosViewComponent implements AfterViewInit {

  public capacity: number;

  public asteroid: Asteroid;

  public search: SearchResult;

  public timer: string = "00:00:00";

  public isModalOpen: boolean = false;

  public mineRate;

  public oreAmount: JSON;

  public allOreInfo: OreInfo[];

  constructor(private userS: UserService, private upgradeS: UpgradeService,
    private socketS: SocketService, private oreInfoS: OreInfoService) {
    this.oreAmount = userS.currentUser.oreAmounts;

    this.capacity =upgradeS.storage[userS.currentUser.storageLvl].capacity;

    this.asteroid = userS.currentUser.asteroid;

    this.search = userS.currentUser.asteroidSearch;

    this.mineRate = userS.currentUser.currentMineRate;

    this.allOreInfo = oreInfoS.oreInfo;

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
      this.capacity =this.upgradeS.storage[this.userS.currentUser.storageLvl].capacity;
    });
    this.userS.searchSubject.subscribe((user: User) => {
      this.search = user.asteroidSearch;
      this.timer = this.secondsToHHMMSS(this.search.timer / 1000);
      if (user.asteroidSearch.results.length != 3) {
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
        this.socketS.updateAsteroidTimer();
      }
    }
  }

  searchNewAster() {
    this.socketS.searchAsteroid();
  }

  rejectResults() {
    this.socketS.rejectResults();
  }

  secondsToHHMMSS(time: number) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    let seconds = Math.floor(time - (hours * 3600) - (minutes * 60));

    let out = hours < 10 ? "0" + hours : "" + hours;
    out += minutes < 10 ? ":0" + minutes : ":" + minutes;
    out += seconds < 10 ? ":0" + seconds : ":" + seconds;

    return out;
  }

  showResult() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
