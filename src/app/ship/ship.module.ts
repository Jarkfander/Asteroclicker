import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipViewComponent } from './ship-view/ship-view.component';
import {  UpgradeViewComponent } from './upgrade-view/upgrade-view.component';
import { UserService } from '../shared/user/user.service';
import { UpgradeListComponent } from './upgrade-list/upgrade-list.component';
import { UpgradeService } from './upgrade.service';
import { UpgradeInfoComponent } from './upgrade-info/upgrade-info.component';
import { QgViewComponent } from './qg-view/qg-view.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  declarations: [ShipViewComponent, UpgradeListComponent, UpgradeViewComponent, UpgradeInfoComponent, QgViewComponent],
  exports: [ShipViewComponent, UpgradeListComponent, UpgradeViewComponent, QgViewComponent],
  providers: [UserService, UpgradeService]
})
export class ShipModule { }
