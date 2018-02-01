import { Component, OnInit } from '@angular/core';
import { OreService, IOreInfos } from '../../ore/ore.service';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';


@Component({
  selector: 'app-market-list',
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.scss']
})
export class MarketListComponent implements OnInit {

  // TODO : set color elsewhere (BDD ?)
  public allOre = [{
    name: 'carbon',
    color: '102,119,4,1',
    unlocked: false
  }, {
    name: 'iron',
    color: '175,175,175,1',
    unlocked: false
  }, {
    name: 'titanium',
    color: '105,101,122,1',
    unlocked: false
  }, {
    name: 'gold',
    color: '255,238,0,1',
    unlocked: false
  }, {
    name: 'hyperium',
    color: '255,0,234,1',
    unlocked: false,
  }];

  constructor(private oreS: OreService, private userS: UserService) {

  }

  ngOnInit(): void {
    this.oreS.OreInfos
      .first()
      .subscribe((oreInfos: IOreInfos) => {
        this.userS.getUpgradeByName('research')
          .subscribe((upgrade: IUserUpgrade) => {
            for (let i=0; i < this.allOre.length; i++) {
              this.allOre[i].unlocked = upgrade.lvl >= oreInfos[this.allOre[i].name].searchNewOre;
            }
          });

      });
  }

}
