import { Component, OnInit } from '@angular/core';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { Observable } from 'rxjs/Observable';
import { ResourcesService } from '../../shared/resources/resources.service';
import { UpgradeService } from '../../ship/upgrade.service';
import { OreService, IOreAmounts } from '../ore.service';
import { staggerTile } from './../../shared/animations';

import { map, take, combineLatest, scan } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

interface IOreData {
  name: string;
  order: number;
  amount: Observable<number>;
  activated: Observable<boolean>;
}

@Component({
  selector: 'app-ore-list',
  templateUrl: './ore-list.component.html',
  styleUrls: ['./ore-list.component.scss'],
  animations: [staggerTile]
})

export class OreListComponent implements OnInit {

  private oreInfos: IOreInfos;
  public oreData$: Observable<IOreData[]>;
  public oreData: IOreData[];
  public nextOre: IOreData;
  public mineRate: number;
  public capacity: number;

  constructor(private userS: UserService,
              private resourcesS: ResourcesService,
              private oreInfoS: OreService) {}

  ngOnInit() {
    this.oreInfos = this.oreInfoS.oreInfos;
    this.oreData = Object.keys(this.oreInfos)
      .map((name: string) => {
        return {
          name: name,
          amount: this.getAmount(name),
          order: this.oreInfos[name].order,
          activated: this.isActivated(name)
        };
      })
      .sort((a: IOreData, b: IOreData) => a.order - b.order);

    this.userS.getUpgradeByName('storage')
      .map((upgrade: IUserUpgrade) => this.resourcesS.storage[upgrade.lvl].capacity)
      .subscribe((capacity: number) => this.capacity = capacity);

    this.userS.mineRateSubject
      .map((user: User) => user.currentMineRate)
      .subscribe((mineRate: number) => this.mineRate = mineRate);
  }

  /** Return the amount of the ore */
  private getAmount(name: string): Observable<number> {
    return this.oreInfoS.OreAmounts
      .map((oreAmounts: IOreAmounts) => oreAmounts[name]);
  }

  /** Check if ore is activated */
  public isActivated(name: string): Observable<boolean> {
    return this.userS.getUpgradeByName('research')
      .map((upgrade) => upgrade.lvl)
      .map((researchLvl) => {
        return this.upgradeS.research[researchLvl].lvl >= this.oreInfos[name].searchNewOre;
      });
  }

}
