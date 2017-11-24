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

  public storageLvl: number;
  public researchLvl: number;

  public asteroid: Asteroid;

  public search: AsteroidSearch;

  public carbonQuantity;
  public titaniumQuantity;

  public carbonOverload: boolean = false;
  public titaniumOverload: boolean = false;

  public timer: string = "00:00:00";

  public isModalOpen: boolean = false;

  public mineRate;

  public carbonInfo:OreInfo;
  public titaniumInfo:OreInfo;

  constructor(private userS: UserService, private upgradeS: UpgradeService,
    private socketS: SocketService, private oreInfoS: OreInfoService) {
      this.carbonQuantity = userS.currentUser.carbon;
      this.titaniumQuantity = userS.currentUser.titanium;

      this.storageLvl = userS.currentUser.storageLvl;
      this.researchLvl = userS.currentUser.researchLvl;

      this.carbonOverload = userS.currentUser.carbon >= this.upgradeS.storage[this.storageLvl].capacity;
      this.titaniumOverload = userS.currentUser.titanium >= this.upgradeS.storage[this.storageLvl].capacity;

      this.asteroid = userS.currentUser.asteroid;

      this.search = userS.currentUser.asteroidSearch;

      this.mineRate=userS.currentUser.currentMineRate;

      this.carbonInfo=oreInfoS.getOreInfoByString("carbon");
      this.titaniumInfo=oreInfoS.getOreInfoByString("titanium");
  }

  ngAfterViewInit() {
    this.userS.oreSubject.subscribe((user: User) => {
      this.carbonQuantity = user.carbon;
      this.titaniumQuantity = user.titanium;

      this.carbonOverload = user.carbon >= this.upgradeS.storage[this.storageLvl].capacity;
      this.titaniumOverload = user.titanium >= this.upgradeS.storage[this.storageLvl].capacity;
    });
    this.userS.asteroidSubject.subscribe((user: User) => {
      this.asteroid = user.asteroid;
    });
    this.userS.upgradeSubject.subscribe((user: User) => {
      this.storageLvl = user.storageLvl;
      this.researchLvl = user.researchLvl;
    });
    this.userS.searchSubject.subscribe((user: User) => {
      this.search = user.asteroidSearch;
      if (user.asteroidSearch.results.length != 3) {
        this.isModalOpen = false;
      }
    });
    this.userS.mineRateSubject.subscribe((user: User) => {
      this.mineRate=user.currentMineRate;
    });
    

    setInterval(() => { this.updateTimer(); }, 1000);
  }

  updateTimer() {
    if (this.search.timer != 0) {

      if (this.search.results.length == 0) {

        const timeLeft = (this.upgradeS.research[this.researchLvl].time * 1000)
          - (Date.now() - this.search.timer);
        if (timeLeft < 0) {
          this.socketS.researchFinished();
        }
        else {
          this.timer = this.secondsToHHMMSS(timeLeft / 1000);
        }

      }
      else if (this.search.results.length == 1) {
        const timeLeft = (this.search.results[0].timeToGo * 1000)
          - (Date.now() - this.search.timer);
        if (timeLeft < 0) {
          this.socketS.arrivedToAsteroid();
        }
        else {
          this.timer = this.secondsToHHMMSS(timeLeft / 1000);
        }

      }
    }
  }


  searchNewAster() {
    this.socketS.searchAsteroid();
  }

  rejectResults() {
    this.socketS.rejectResults();
  }

  fillInfos(user: User) {

    //this.AsteroidRate = this.oreInfoS.getOreInfoByString(this.user.asteroid.ore).miningSpeed *
    //  this.user.asteroid.purity / 100;
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
