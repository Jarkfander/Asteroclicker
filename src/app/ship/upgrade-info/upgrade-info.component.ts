import { enter } from './upgrade-info.animations';
import { OreInfo } from './../../ore/ore-view/oreInfo';
import { UserService, IUserUpgrade } from './../../shared/user/user.service';
import { OreService } from './../../ore/ore.service';
import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Utils } from '../../shared/utils';
import { Upgrade } from '../upgrade-class/upgrade';
import { UpgradeService } from '../upgrade.service';
import { ResourcesService } from '../../shared/resources/resources.service';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/filter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-upgrade-info',
  templateUrl: './upgrade-info.component.html',
  styleUrls: ['./upgrade-info.component.scss'],
  animations: [enter]
})
export class UpgradeInfoComponent implements OnInit {

  private alive = true;
  public userUpgrade: IUserUpgrade;
  public currentLvl: Upgrade;
  public nextLvl: Upgrade;
  public caraKeys: string[];
  public nextCaraKeys: string[];

  @Input('upgrade') set upgrade(userUpgrade: IUserUpgrade) {
    this.userUpgrade = userUpgrade;
    if (!userUpgrade) { return; }
    this.currentLvl = this.resourcesS[userUpgrade.name][userUpgrade.lvl];
    this.nextLvl = this.resourcesS[userUpgrade.name][userUpgrade.lvl + 1];
    this.caraKeys = Object.keys(this.currentLvl.cara);
    this.nextCaraKeys = Object.keys(this.nextLvl.cara);
  }

  constructor(private resourcesS: ResourcesService) { }

  ngOnInit() {
    /*
    this.upgradeS.activeUserUpgrade$
      .takeWhile(() => this.alive)
      .do((userUpgrade: IUserUpgrade) => this.userUpgrade = userUpgrade)
      .filter((userUpgrade: IUserUpgrade) => !!userUpgrade)
      .subscribe((userUpgrade: IUserUpgrade) => {
        this.currentLvl = this.resourcesS[userUpgrade.name][userUpgrade.lvl];
        this.nextLvl = this.resourcesS[userUpgrade.name][userUpgrade.lvl + 1];
        this.caraKeys = Object.keys(this.currentLvl.cara);
        this.nextCaraKeys = Object.keys(this.nextLvl.cara);
      });
      */
  }


}
