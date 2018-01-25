import { enter } from './upgrade-info.animations';
import { OreInfo } from './../../ore/ore-view/oreInfo';
import { UserService, IUserUpgrade } from './../../shared/user/user.service';
import { OreService, IOreInfos } from './../../ore/ore.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Utils } from '../../shared/utils';
import { Upgrade } from '../upgrade-class/upgrade';
import { UpgradeService } from '../upgrade.service';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-upgrade-info',
  templateUrl: './upgrade-info.component.html',
  styleUrls: ['./upgrade-info.component.scss'],
  animations: [enter]
})
export class UpgradeInfoComponent implements OnInit, OnDestroy {

  private alive = true;
  public userUgrade: IUserUpgrade;
  public currentLvl: Upgrade;
  public nextLvl: Upgrade;
  public caraKeys: string[];
  public nextCaraKeys: string[];

  constructor(private oreS: OreService, private userS: UserService, private upgradeS: UpgradeService) { }

  ngOnInit() {
    this.upgradeS.activeUserUpgrade$
      .takeWhile(() => this.alive)
      .do((userUpgrade: IUserUpgrade) => this.userUgrade = userUpgrade)
      .filter((userUgrade: IUserUpgrade) => !!userUgrade)
      .subscribe((userUgrade: IUserUpgrade) => {
        this.currentLvl = this.upgradeS[userUgrade.name][userUgrade.lvl];
        this.nextLvl = this.upgradeS[userUgrade.name][userUgrade.lvl + 1];
        this.caraKeys = Object.keys(this.currentLvl.cara);
        this.nextCaraKeys = Object.keys(this.nextLvl.cara);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
