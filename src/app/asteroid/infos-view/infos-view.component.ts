import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';
import { SocketService } from '../../socket/socket.service';
import { OreInfoService } from '../ore-info.service';
import { Asteroid } from '../asteroid';
import { AsteroidSearch } from '../asteroidSearch';
import { OreInfo } from '../oreInfo';

@Component({
  selector: 'app-infos-view',
  templateUrl: './infos-view.component.html',
  styleUrls: ['./infos-view.component.scss']
})
export class InfosViewComponent implements AfterViewInit {

  public capacity: number;

  public asteroid: Asteroid;

  public search: AsteroidSearch;

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
