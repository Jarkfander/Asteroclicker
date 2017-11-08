import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';
import { AsteroidService } from '../asteroid.service';

@Component({
  selector: 'app-infos-view',
  templateUrl: './infos-view.component.html',
  styleUrls: ['./infos-view.component.scss']
})
export class InfosViewComponent implements AfterViewInit {
  public user: User;
  public storageOverload: boolean = false;
  public Asteroidname: string;

  constructor(private userS: UserService, private upgradeS: UpgradeService, private AsteroidS: AsteroidService) {
    this.user = this.userS.currentUser;
    this.storageOverload = this.user.carbon >= this.upgradeS.storage[this.user.storageLvl].capacity;
    const name = AsteroidS.asteroidManaged[this.user.numAsteroid].ore;
    this.Asteroidname = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
  }

  ngAfterViewInit() {
    this.userS.userSubject.subscribe((user: User) => {
      this.user = user;
      this.storageOverload = this.user.carbon >= this.upgradeS.storage[this.user.storageLvl].capacity;
    });
  }

}
