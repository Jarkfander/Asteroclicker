import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Research } from '../upgrade-class/research';
import { MineRate } from '../upgrade-class/mineRate';
import { Storage } from '../upgrade-class/storage';
import { UpgradeService } from './upgrade.service';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService } from '../../shared/user/user.service';
import { User } from '../../shared/user/user';

@Component({
    selector: 'app-upgrade-list',
    templateUrl: './upgrade-list.component.html',
    styleUrls: ['./upgrade-list.component.scss']
})
export class UpgradeViewComponent implements AfterViewInit {

    public selectedUpdate;

    public storageLvl: number;
    public mineRateLvl: number;
    public stock: Storage[];
    public mineRate: MineRate[];
    public research: Research[];
    public timerMine: string;
    public timerStock: string;

    constructor(private el: ElementRef,
                private render: Renderer2,
                private userS: UserService,
                private upgradeS: UpgradeService,
                private socketS: SocketService) {
        this.stock = upgradeS.storage;
        this.storageLvl = userS.currentUser.storageLvl;
        this.mineRateLvl = userS.currentUser.mineRateLvl;
        this.mineRate = upgradeS.mineRate;
        this.research = upgradeS.research;
    }

    ngAfterViewInit() {
        this.userS.upgradeSubject.subscribe((user: User) => {
            this.storageLvl = user.storageLvl;
            this.mineRateLvl = user.mineRateLvl;
        });
        setInterval(() => {
            this.updateTimer(this.userS.currentUser.timerRate, this.timerMine, this.mineRateLvlUp,
                this.upgradeS.mineRate[this.userS.currentUser.mineRateLvl].time);
            this.updateTimer(this.userS.currentUser.timerStock, this.timerStock, this.stockLvlUp,
                this.upgradeS.storage[this.userS.currentUser.storageLvl].time);
        }, 1000);
    }

    stockLvlUp() {
        if (this.userS.currentUser.credit > this.stock[this.storageLvl + 1].cost) {
            this.socketS.upgradeShip('storage');
        }
    }

    mineRateLvlUp() {
        if (this.userS.currentUser.credit > this.mineRate[this.mineRateLvl + 1].cost) {
            this.socketS.upgradeShip('mineRate');
        }
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
