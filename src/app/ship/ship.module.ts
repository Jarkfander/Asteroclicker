import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipViewComponent } from './ship-view/ship-view.component';
import { UpgradeViewComponent } from './upgrade-view/upgrade-view.component';
import { UserService } from '../user/user.service';
import { UpgradeService } from '../upgrade/upgrade.service';
import { UpgradeInfoComponent } from './upgrade-view/upgrade-info/upgrade-info.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShipViewComponent, UpgradeViewComponent, UpgradeInfoComponent],
  exports: [ShipViewComponent, UpgradeViewComponent],
  providers: [UserService, UpgradeService]
})
export class ShipModule { }
