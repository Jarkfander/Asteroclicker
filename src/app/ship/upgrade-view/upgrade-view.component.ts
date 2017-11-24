import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UpgradeService } from '../../upgrade/upgrade.service';
import { Storage } from '../../upgrade/Storage';
import { MineRate } from '../../upgrade/MineRate';
import { SocketService } from '../../socket/socket.service';
import { Research } from '../../upgrade/research';


@Component({
    selector: 'app-upgrade-view',
    templateUrl: './upgrade-view.component.html',
    styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeViewComponent implements AfterViewInit {
    public storageLvl: number;
    public mineRateLvl: number;
    public stock: Storage[];
    public mineRate: MineRate[];
    public research: Research[];

    constructor(private el: ElementRef, private render: Renderer2, private userS: UserService,
        private upgradeS: UpgradeService, private socketS: SocketService) {
        this.stock = upgradeS.storage;
        this.storageLvl=userS.currentUser.storageLvl;
        this.mineRateLvl=userS.currentUser.mineRateLvl;
        this.mineRate = upgradeS.mineRate;
        this.research = upgradeS.research;
    }

    ngAfterViewInit() {
        this.userS.upgradeSubject.subscribe((user: User) => {
            this.storageLvl=user.storageLvl;
            this.mineRateLvl=user.mineRateLvl;
        });
    }

    stockLvlUp() {
        if (this.userS.currentUser.credit > this.stock[this.storageLvl + 1].cost) {
            this.socketS.upgradeShip("storage");
        }
    }

    mineRateLvlUp() {
        if (this.userS.currentUser.credit > this.mineRate[this.mineRateLvl + 1].cost) {
            this.socketS.upgradeShip("mineRate")
        }
    }
}
