import { Component, OnInit } from '@angular/core';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { UpgradeService } from '../../ship/upgrade.service';
import { Observable } from 'rxjs/Observable';
import { OreService, IOreAmounts } from '../ore.service';

interface IOreData {
  name: string;
  amount: number;
}

@Component({
  selector: 'app-ore-list',
  templateUrl: './ore-list.component.html',
  styleUrls: ['./ore-list.component.scss']
})

export class OreListComponent implements OnInit {

  public oreData$: Observable<IOreData[]>;
  public nextOre: IOreData;
  public mineRate: number;
  public capacity: number;

  constructor(private userS: UserService,
              private upgradeS: UpgradeService,
              private oreInfoS: OreService) {}

  ngOnInit() {
    this.mineRate = this.userS.currentUser.currentMineRate;
    this.oreData$ = this.oreInfoS.OreAmounts
      .map((oreAmounts: IOreAmounts) => Object.keys(oreAmounts).map(oreName => {
        return { name: oreName, amount: oreAmounts[oreName] };
      }))
      .do((oreDatas: IOreData[]) => {
        this.nextOre = oreDatas.find((data: IOreData) => data.amount === 0);
      });

    this.userS.getUpgradeByName('storage')
      .map((upgrade: IUserUpgrade) => this.upgradeS.storage[upgrade.lvl].capacity)
      .subscribe((capacity: number) => this.capacity = capacity);

    this.userS.mineRateSubject
      .map((user: User) => user.currentMineRate)
      .subscribe((mineRate: number) => this.mineRate = mineRate);
  }


}
