import { Component, OnInit, Input } from '@angular/core';
import { Upgrade } from '../../../upgrade/upgrade';
import { SocketService } from '../../../socket/socket.service';

@Component({
  selector: 'app-upgrade-info',
  templateUrl: './upgrade-info.component.html',
  styleUrls: ['./upgrade-info.component.scss']
})
export class UpgradeInfoComponent implements OnInit {

  private _upgrade: Upgrade;
  private _upgradeCaraKeys: string[];

  private _nextUpgrade: Upgrade;
  private _nextupgradeCaraKeys: string[];

  constructor(private socketS:SocketService) { }

  ngOnInit() {
    console.log(Object.keys(this.upgrade.cara));
  }

  @Input() set upgrade(upgrade: Upgrade) {
    this._upgrade = upgrade;
    this._upgradeCaraKeys = Object.keys(this._upgrade.cara);
  }

  @Input() set nextUpgrade(upgrade: Upgrade) {
    this._nextUpgrade = upgrade;
    this._nextupgradeCaraKeys = Object.keys(this._nextUpgrade.cara);
  }

  get upgrade(): Upgrade {
    return this._upgrade;
  }

  get nextUpgrade(): Upgrade {
    return this._nextUpgrade;
  }

  get upgradeCaraKeys(): String[] {
    return this._upgradeCaraKeys;
  }

  get nextUpgradeCaraKeys(): String[] {
    return this._nextupgradeCaraKeys;
  }

  levelUp() {
    this.socketS.upgradeShip(this.upgrade.name);
  }

}
