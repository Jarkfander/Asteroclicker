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

  constructor(private userS: UserService, private upgradeS: UpgradeService,
     private AsteroidS: AsteroidService, private socketS: SocketService) {
    this.fillInfos(this.userS.currentUser);
  }

  ngAfterViewInit() {
    this.userS.userSubject.subscribe((user: User) => {
      this.fillInfos(user);
    });
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
    this.AsteroidRate = this.AsteroidS.asteroidTypes[this.user.numAsteroid].mineRate / 100;
  }

}
