import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';
import { SocketService } from '../../socket/socket.service';
import { OreInfoService } from '../ore-info.service';

@Component({
  selector: 'app-infos-view',
  templateUrl: './infos-view.component.html',
  styleUrls: ['./infos-view.component.scss']
})
export class InfosViewComponent implements AfterViewInit {

  public user: User;
  public carbonOverload: boolean = false;
  public titaniumOverload: boolean = false;
  public Asteroidname: string;
  public AsteroidRate: number;
  public timer: string;

  public isModalOpen: boolean = false;

  constructor(private userS: UserService, private upgradeS: UpgradeService,
    private socketS: SocketService, private oreInfoS: OreInfoService) {
    this.fillInfos(this.userS.currentUser);
  }

  ngAfterViewInit() {
    this.userS.userSubject.subscribe((user: User) => {
      this.fillInfos(user);
    });
    setInterval(() => { this.updateTimer(); }, 1000);
  }

  updateTimer() {
    //console.log(this.user.asteroidSearch.timer);
    if (this.user.asteroidSearch.timer != 0 && this.user.asteroidSearch.results.length == 0 || this.user.asteroidSearch.results.length == 0) {
      const timeLeft = (this.upgradeS.research[this.user.researchLvl].time * 60 * 1000)
        - (Date.now() - this.user.asteroidSearch.timer);

      if (timeLeft < 0) {
        //console.log("0");
        if (this.user.asteroidSearch.results.length == 0) {
          //console.log("finished");
          this.socketS.researchFinished();
        }
        else if (this.user.asteroidSearch.results.length == 1) {
          //console.log("arrived");
          this.socketS.arrivedToAsteroid();
        }

      }
      else {
        this.timer = this.secondsToHHMMSS(timeLeft / 1000);
      }
    }
  }


  searchNewAster() {
    this.socketS.searchAsteroid();
  }

  fillInfos(user: User) {
    this.user = user;
    this.carbonOverload = this.user.carbon >= this.upgradeS.storage[this.user.storageLvl].capacity;
    this.titaniumOverload = this.user.titanium >= this.upgradeS.storage[this.user.storageLvl].capacity;
    const name = this.user.asteroid.ore;
    this.Asteroidname = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
    this.AsteroidRate = this.oreInfoS.getOreInfoByString(this.user.asteroid.ore).miningSpeed *
      this.user.asteroid.purity / 100;
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
