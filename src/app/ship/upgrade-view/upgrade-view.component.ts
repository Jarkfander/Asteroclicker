import { Component, OnInit, Input } from '@angular/core';
import { Upgrade } from '../upgrade-class/upgrade';
import { SocketService } from '../../shared/socket/socket.service';


@Component({
  selector: 'app-upgrade-view',
  templateUrl: './upgrade-view.component.html',
  styleUrls: ['./upgrade-view.component.scss']
})
export class UpgradeInfoComponent implements OnInit {

  private _upgrade: Upgrade;
  private _upgradeCaraKeys: string[];

  private _nextUpgrade: Upgrade;
  private _nextupgradeCaraKeys: string[];

  constructor(private socketS: SocketService) { }

  ngOnInit() {
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
