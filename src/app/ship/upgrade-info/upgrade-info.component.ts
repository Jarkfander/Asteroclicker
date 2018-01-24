import { OreInfo } from './../../ore/ore-view/oreInfo';
import { UserService } from './../../shared/user/user.service';
import { OreService, IOreInfos } from './../../ore/ore.service';
import { Component, OnInit, Input } from '@angular/core';
import { Utils } from '../../shared/utils';
import { IUpgrade } from '../../shared/user/user.service';

import 'rxjs/add/operator/first';
import { Upgrade } from '../upgrade-class/upgrade';
import { UpgradeService } from '../upgrade.service';

@Component({
  selector: 'app-upgrade-info',
  templateUrl: './upgrade-info.component.html',
  styleUrls: ['./upgrade-info.component.scss']
})
export class UpgradeInfoComponent implements OnInit {

  @Input() name: string;
  @Input() lvl: number;

  public currentLvl: Upgrade;
  public nextLvl: Upgrade;
  public caraKeys: string[];
  public nextCaraKeys: string[];

  constructor(private oreS: OreService, private userS: UserService, private upgradeS: UpgradeService) { }

  ngOnInit() {
    this.currentLvl = this.upgradeS[this.name][this.lvl];
    this.nextLvl = this.upgradeS[this.name][this.lvl + 1];
    this.caraKeys = Object.keys(this.currentLvl.cara);
    this.nextCaraKeys = Object.keys(this.nextLvl.cara);
  }

}
