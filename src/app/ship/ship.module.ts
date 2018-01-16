import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipViewComponent } from './ship-view/ship-view.component';
import {  UpgradeInfoComponent } from './upgrade-view/upgrade-view.component';
import { UserService } from '../shared/user/user.service';
import { UpgradeViewComponent } from './upgrade-list/upgrade-list.component';
import { UpgradeService } from './upgrade.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShipViewComponent, UpgradeViewComponent, UpgradeInfoComponent],
  exports: [ShipViewComponent, UpgradeViewComponent],
  providers: [UserService, UpgradeService]
})
export class ShipModule { }
