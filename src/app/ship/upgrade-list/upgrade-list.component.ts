import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Research } from '../upgrade-class/research';
import { MineRate } from '../upgrade-class/mineRate';
import { Storage } from '../upgrade-class/storage';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';
import { Upgrade, UpgradeType } from '../upgrade-class/upgrade';
import { UpgradeService } from '../upgrade.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';



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

    constructor(private el: ElementRef, private render: Renderer2, private userS: UserService,
        private upgradeS: UpgradeService, private socketS: SocketService) {

    }

    ngOnInit() {
        this.storageLvls = this.upgradeS.mineRate;
        this.mineRateLvls = this.upgradeS.research;
        this.researchLvls = this.upgradeS.storage;
        this.engineLvls = this.upgradeS.engine;
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
