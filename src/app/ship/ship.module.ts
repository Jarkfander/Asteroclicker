import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipViewComponent } from './ship-view/ship-view.component';
import {  UpgradeViewComponent } from './upgrade-view/upgrade-view.component';
import { UserService } from '../shared/user/user.service';
import { UpgradeListComponent } from './upgrade-list/upgrade-list.component';
import { UpgradeService } from './upgrade.service';
import { UpgradeInfoComponent } from './upgrade-info/upgrade-info.component';


@NgModule({
  imports: [
    CommonModule
  ],
<<<<<<< HEAD
  declarations: [ShipViewComponent, UpgradeListComponent, UpgradeViewComponent, UpgradeInfoComponent],
  exports: [ShipViewComponent,UpgradeListComponent, UpgradeViewComponent],
=======
  declarations: [ShipViewComponent, UpgradeListComponent, UpgradeViewComponent],
  exports: [ShipViewComponent, UpgradeListComponent, UpgradeViewComponent],
>>>>>>> a23714cf933ba79abacafbd57a293382e8efb522
  providers: [UserService, UpgradeService]
})
export class ShipModule { }
