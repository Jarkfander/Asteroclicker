import { Component, OnInit, Input } from '@angular/core';
import { OreService, IOreInfo } from '../ore.service';
import { Observable } from 'rxjs/Observable';
import { UserService, IUpgrade } from '../../shared/user/user.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { AsteroidService, IAsteroid } from '../../asteroid/asteroid.service';


@Component({
  selector: 'app-ore-view',
  templateUrl: './ore-view.component.html',
  styleUrls: ['./ore-view.component.scss']
})
export class OreViewComponent implements OnInit {

  @Input('name') name: string;
  @Input('amount') amount: number;
  @Input('rate') rate: number;
  @Input('capacity') capacity: number;

  public oreInfo: IOreInfo;
  public researchLvl: number=1;
  public oreCoef: number = 0;
  public displayRate: string;

  public isRateDisplayed : boolean=false;
  constructor(private oreS: OreService, private userS: UserService, private asteroidS: AsteroidService) { }

  ngOnInit() {
    this.oreS.getOreInfoByString(this.name).take(1).subscribe((oreInfo: IOreInfo) => {
      this.oreInfo = oreInfo;
      this.asteroidS.asteroid.subscribe((aste: IAsteroid) => {
        this.oreCoef = oreInfo.miningSpeed * (aste.purity / 100);
        this.isRateDisplayed=aste.ore==this.name;
      });

    });
    this.userS.getUpgradeByName("research").subscribe((upgrade:IUpgrade)=>{
      this.researchLvl=upgrade.lvl;
    });
  }
}
