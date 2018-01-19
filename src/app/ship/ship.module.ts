import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipViewComponent } from './ship-view/ship-view.component';
import {  UpgradeViewComponent } from './upgrade-view/upgrade-view.component';
import { UserService } from '../shared/user/user.service';
import { UpgradeListComponent } from './upgrade-list/upgrade-list.component';
import { UpgradeService } from './upgrade.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShipViewComponent, UpgradeListComponent, UpgradeViewComponent],
  exports: [ShipViewComponent,UpgradeListComponent, UpgradeViewComponent],
  providers: [UserService, UpgradeService]
})
export class ShipModule { }
