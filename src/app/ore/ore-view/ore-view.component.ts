import { Component, OnInit, Input } from '@angular/core';
import { OreService, IOreInfo } from '../ore.service';
import { Observable } from 'rxjs/Observable';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { AsteroidService, IAsteroid } from '../../asteroid/asteroid.service';
import { figuesChange } from './../../shared/animations';

import 'rxjs/add/operator/first';

@Component({
  selector: 'app-ore-view',
  templateUrl: './ore-view.component.html',
  styleUrls: ['./ore-view.component.scss'],
  animations: [figuesChange]
})
export class OreViewComponent implements OnInit {

  @Input('name') name: string;
  @Input('amount') amount: number;
  @Input('rate') rate: number;
  @Input('capacity') capacity: number;

  public oreInfo: IOreInfo;
  public mineRate$: Observable<number>;
  public researchLvl = 1;
  public oreCoef = 0;
  public displayRate: string;

  public isRateDisplayed = false;
  constructor(private oreS: OreService, private userS: UserService, private asteroidS: AsteroidService) { }

  ngOnInit() {
    this.oreInfo = this.oreS.oreInfos[this.name];
    this.mineRate$ = this.asteroidS.asteroid$
      .filter((aste: IAsteroid) => aste.ore === this.name)
      .map((aste: IAsteroid) => {
        return this.oreInfo.miningSpeed * (aste.purity / 100) * this.rate;
      });
    /*
      this.asteroidS.asteroid
      .subscribe((aste: IAsteroid) => {
        this.oreCoef = this.oreInfo.miningSpeed * (aste.purity / 100);
        this.isRateDisplayed = (aste.ore === this.name);
      });
    */
  }
}

// (this.oreCoef * this.rate)