import { Component, OnInit } from '@angular/core';
import { OreService } from '../../ore/ore.service';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { ResourcesService } from '../../shared/resources/resources.service';


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

  constructor(private oreS: OreService, private userS: UserService,private resourcesS:ResourcesService) {

  }

  ngOnInit(): void {

    this.userS.getUpgradeByName('research')
      .subscribe((upgrade: IUserUpgrade) => {
        for (let i = 0; i < this.allOre.length; i++) {
          this.allOre[i].unlocked = upgrade.lvl >= this.resourcesS.oreInfos[this.allOre[i].name].searchNewOre;
        }
      });
  }

}
