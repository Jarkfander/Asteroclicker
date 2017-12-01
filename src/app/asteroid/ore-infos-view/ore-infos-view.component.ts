import { OreInfos } from './oreInfos';
import { SearchResult } from './../search-result/searchResult';
import { Asteroid } from './../asteroid-view/asteroid';
import { UpgradeService } from '../../ship/upgrade-list/upgrade.service';
import { UserService } from './../../shared/user/user.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { User } from '../../shared/user/user';

@Component({
  selector: 'app-ore-infos-view',
  templateUrl: './ore-infos-view.component.html',
  styleUrls: ['./ore-infos-view.component.scss']
})
export class OreInfosViewComponent implements OnInit, AfterViewInit {

  /*
  @Input('amount') amount: number ;
  @Input('rate') rate: number ;
  @Input('capacity') capacity: number;
  */
  @Input('ore') ore: OreInfos;

  public capacity: number;
  public asteroid: Asteroid;
  public mineRate;
  public oreAmount: JSON;
  public search: SearchResult;

  constructor(private userS: UserService, private upgradeS: UpgradeService) { }

  public get rate(): string {
    if (this.hasRate) {
      return (this.ore.miningSpeed * (this.asteroid.purity / 100) * this.mineRate).toFixed(2);
    }
  }

  public hasRate(): boolean {
    return ((this.asteroid.ore === this.ore.name)
        && (this.asteroid.currentCapacity > 0)
        && (this.oreAmount[this.ore.name] < this.capacity))
  }

  ngOnInit() {
    this.oreAmount = this.userS.currentUser.oreAmounts;
    this.capacity = this.upgradeS.storage[this.userS.currentUser.storageLvl].capacity;
    this.asteroid = this.userS.currentUser.asteroid;
    this.search = this.userS.currentUser.asteroidSearch;
    this.mineRate = this.userS.currentUser.currentMineRate;
  }

  ngAfterViewInit() {
    this.userS.oreSubject.subscribe((user: User) => {
      this.oreAmount = user.oreAmounts;
    });
    this.userS.asteroidSubject.subscribe((user: User) => {
      this.asteroid = user.asteroid;
    });
    this.userS.upgradeSubject.subscribe((user: User) => {
      this.capacity = this.upgradeS.storage[this.userS.currentUser.storageLvl].capacity;
    });
    this.userS.mineRateSubject.subscribe((user: User) => {
      this.mineRate = user.currentMineRate;
    });
  }

}
