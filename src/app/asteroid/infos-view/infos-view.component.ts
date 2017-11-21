import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';
import { AsteroidService } from '../asteroid.service';
import { SocketService } from '../../socket/socket.service';

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
    private AsteroidS: AsteroidService, private socketS: SocketService) {
    this.fillInfos(this.userS.currentUser);
  }

  ngAfterViewInit() {
    this.userS.userSubject.subscribe((user: User) => {
      this.fillInfos(user);
    });
    setInterval(() => { this.updateTimer(); }, 1000);
  }

  updateTimer() {
    if (this.user.asteroidSearch.results.length == 0) {
      const timeLeft = (this.upgradeS.research[this.user.researchLvl].time * 60 * 1000)
        - (Date.now() - this.user.asteroidSearch.timer);

      if (timeLeft >= 0) {
        this.timer = this.secondsToHHMMSS(timeLeft / 1000);
      }
      else {
        this.socketS.researchFinished();
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
    const name = this.AsteroidS.asteroidTypes[this.user.numAsteroid].ore;
    this.Asteroidname = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
    this.AsteroidRate = this.AsteroidS.asteroidTypes[this.user.numAsteroid].purity / 100;
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
    this.isModalOpen=true;
  }

  closeModal() {
    this.isModalOpen=false;
  }

}
