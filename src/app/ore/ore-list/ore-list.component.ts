import { Component, OnInit } from '@angular/core';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { UpgradeService } from '../../ship/upgrade.service';
import { Observable } from 'rxjs/Observable';
import { OreService, IOreAmounts } from '../ore.service';

@Component({
  selector: 'app-ore-list',
  templateUrl: './ore-list.component.html',
  styleUrls: ['./ore-list.component.scss']
})

export class OreListComponent implements OnInit {

  public ores = ['carbon', 'iron', 'titanium', 'gold', 'hyperium'];
  public oreAmounts$: Observable<IOreAmounts>;
  public mineRate: number;
  public capacity: number;

  constructor(private userS: UserService,
              private upgradeS: UpgradeService,
              private oreInfoS: OreService) {}

  ngOnInit() {
    this.oreAmounts$ = this.oreInfoS.OreAmounts;
    this.mineRate = this.userS.currentUser.currentMineRate;

    this.userS.getUpgradeByName("storage")
      .map((upgrade: IUserUpgrade) => this.upgradeS.storage[upgrade.lvl].capacity)
      .subscribe((capacity: number) => this.capacity = capacity);

    this.userS.mineRateSubject
      .map((user: User) => user.currentMineRate)
      .subscribe((mineRate: number) => this.mineRate = mineRate);
  }


}
