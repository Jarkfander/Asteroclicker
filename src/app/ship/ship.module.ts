import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipViewComponent } from './ship-view/ship-view.component';
import { UpgradeViewComponent } from './upgrade-view/upgrade-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShipViewComponent, UpgradeViewComponent],
  exports: [ShipViewComponent, UpgradeViewComponent]
})
export class ShipModule { }
