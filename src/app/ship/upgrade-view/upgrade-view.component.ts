import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';
import { Storage } from '../../upgrade/Storage';
import { MineRate } from '../../upgrade/MineRate';
import { SocketService } from '../../socket/socket.service';


@Component({
    selector: 'app-upgrade-view',
    templateUrl: './upgrade-view.component.html',
    styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeViewComponent implements AfterViewInit {
    public user: User;
    public stock: Storage[];
    public mineRate: MineRate[];

    constructor(private el: ElementRef, private render: Renderer2, private userS: UserService,
         private upgradeS: UpgradeService,private socketS: SocketService) {
        this.stock = upgradeS.storage;
        this.user = userS.currentUser;
        this.mineRate = upgradeS.mineRate;
    }

    ngAfterViewInit() {
        this.userS.userSubject.subscribe((user: User) => {
            this.user = user;
        });
        this.upgradeS.upgradeStockSubject.subscribe((tabStock: Storage[]) => {
            this.stock = tabStock;
        });

        this.upgradeS.upgradeMineRateSubject.subscribe((tabMineRate: MineRate[]) => {
            this.mineRate = tabMineRate;
        });

    }

    stockLvlUp() {
        if (this.userS.currentUser.credit > this.stock[this.user.storageLvl + 1].cost) {
            this.socketS.upgradeShip("storage");
        }
    }

    mineRateLvlUp() {
        if (this.userS.currentUser.credit > this.mineRate[this.user.mineRateLvl + 1].cost) {
            this.socketS.upgradeShip("mineRate")
        }
    }
}
