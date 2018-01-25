import { OreService, IOreAmounts } from './../../ore/ore.service';
import { UserService, IUserUpgrade } from './../../shared/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Research } from '../upgrade-class/research';
import { MineRate } from '../upgrade-class/mineRate';
import { Storage } from '../upgrade-class/storage';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { UpgradeService } from '../upgrade.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';

@Component({
    selector: 'app-upgrade-list',
    templateUrl: './upgrade-list.component.html',
    styleUrls: ['./upgrade-list.component.scss']
})
export class UpgradeListComponent implements OnInit {

    storageLvls: Upgrade[];
    mineRateLvls: Upgrade[];
    researchLvls: Upgrade[];
    engineLvls: Upgrade[];
    QGLvls: Upgrade[];

    public upgrades$: Observable<IUserUpgrade[]>;
    public oreAmount$: Observable<IOreAmounts>;
    public credit$: Observable<number>;
    public researchLvl: number;

    constructor(private upgradeS: UpgradeService,
                private userS: UserService,
                private oreS: OreService) {
    }

    ngOnInit() {
        this.storageLvls = this.upgradeS.storage;
        this.mineRateLvls = this.upgradeS.mineRate;
        this.researchLvls = this.upgradeS.research;
        this.engineLvls = this.upgradeS.engine;
        this.QGLvls = this.upgradeS.QG;

        this.oreAmount$ = this.oreS.OreAmounts;
        this.credit$ = this.userS.credit;
        this.upgrades$ = this.userS.upgrade
            .do((upgrades: IUserUpgrade[]) => this.researchLvl = upgrades.find((upgrade) => upgrade.name === 'research').lvl)
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
