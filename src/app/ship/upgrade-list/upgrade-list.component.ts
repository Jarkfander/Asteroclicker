import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Research } from '../upgrade-class/research';
import { MineRate } from '../upgrade-class/mineRate';
import { Storage } from '../upgrade-class/storage';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { UpgradeService } from '../upgrade.service';



@Component({
    selector: 'app-upgrade-list',
    templateUrl: './upgrade-list.component.html',
    styleUrls: ['./upgrade-list.component.scss']
})
export class UpgradeViewComponent implements AfterViewInit {

    public UpgradeType = UpgradeType;

    public timerMine: string;
    public timerStock: string;

    public allUpgrades: UpgradeLvls[];

    constructor(private el: ElementRef, private render: Renderer2, private userS: UserService,
        private upgradeS: UpgradeService, private socketS: SocketService) {
        this.allUpgrades = new Array();
        this.allUpgrades[UpgradeType.mineRate] = new UpgradeLvls(UpgradeType.mineRate, upgradeS.mineRate);
        this.allUpgrades[UpgradeType.research] = new UpgradeLvls(UpgradeType.research, upgradeS.research);
        this.allUpgrades[UpgradeType.storage] = new UpgradeLvls(UpgradeType.storage, upgradeS.storage);
        this.allUpgrades[UpgradeType.engine] = new UpgradeLvls(UpgradeType.engine, upgradeS.engine);
    }

    ngAfterViewInit() {

        /*setInterval(() => {
            this.updateTimer(this.userS.currentUser.timerRate, this.timerMine, this.mineRateLvlUp,
                this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].time);
            this.updateTimer(this.userS.currentUser.timerStock, this.timerStock, this.stockLvlUp,
                this.upgradeS.storage[this.userS.currentUser.storageLvl].time);
        }, 1000);*/
    }

    // Managed time 
    updateTimer(upgradeTimerUser, upgradeTimer, functionLvlUp, timerUpgradebdd) {
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
    }
}

export class UpgradeLvls {
    public type: UpgradeType;
    public lvls: Upgrade[];

    constructor(type: UpgradeType, lvls: Upgrade[]) {
        this.type = type;
        this.lvls = lvls;
    }
}
