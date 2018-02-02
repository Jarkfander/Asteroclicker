import { OreService, IOreAmounts } from './../../ore/ore.service';
import { UserService, IUserUpgrade } from './../../shared/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Research } from '../upgrade-class/research';
import { MineRate } from '../upgrade-class/mineRate';
import { Storage } from '../upgrade-class/storage';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import { staggerTile } from './../../shared/animations';
import { ResourcesService } from '../../shared/resources/resources.service';

@Component({
    selector: 'app-upgrade-list',
    templateUrl: './upgrade-list.component.html',
    styleUrls: ['./upgrade-list.component.scss'],
    animations: [staggerTile]
})
export class UpgradeListComponent implements OnInit {

    storageLvls: Upgrade[];
    mineRateLvls: Upgrade[];
    researchLvls: Upgrade[];
    engineLvls: Upgrade[];
    QGLvls: Upgrade[];

    public upgradeNames = ['engine', 'research', 'mineRate', 'storage'];
    public upgrades$: Observable<IUserUpgrade[]>;
    public oreAmount$: Observable<IOreAmounts>;
    public credit$: Observable<number>;
    public researchLvl$: Observable<number>;

    constructor(private userS: UserService,
                private resourcesS: ResourcesService,
                private oreS: OreService) {
    }

    ngOnInit() {
        this.storageLvls = this.resourcesS.storage;
        this.mineRateLvls = this.resourcesS.mineRate;
        this.researchLvls = this.resourcesS.research;
        this.engineLvls = this.resourcesS.engine;
        this.QGLvls = this.resourcesS.QG;

        this.oreAmount$ = this.oreS.OreAmounts;
        this.credit$ = this.userS.credit;
        this.researchLvl$ = this.userS.getUpgradeByName('research').map((upgrade) => upgrade.lvl);
    }

    // Managed time
    /* updateTimer(upgradeTimerUser, upgradeTimer, functionLvlUp, timerUpgradebdd) {
         if (upgradeTimerUser !== 0) {
             const timeLeft = (timerUpgradebdd * 60 * 1000)
                 - (Date.now() - upgradeTimerUser);
             if (timeLeft < 0) {
                 //functionLvlUp();
                 //console.log('upgrade Timer');
             } else {
                 upgradeTimer = this.secondsToHHMMSS(timeLeft / 1000);
             }
         }
     }
 
     secondsToHHMMSS(time: number) {
         const hours = Math.floor(time / 3600);
         const minutes = Math.floor((time - (hours * 3600)) / 60);
         const seconds = Math.floor(time - (hours * 3600) - (minutes * 60));
 
         let out = hours < 10 ? '0' + hours : '' + hours;
         out += minutes < 10 ? ':0' + minutes : ':' + minutes;
         out += seconds < 10 ? ':0' + seconds : ':' + seconds;
 
         return out;
     }*/
}
