import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipViewComponent } from './ship-view/ship-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShipViewComponent],
  exports: [ShipViewComponent]
})
export class ShipModule { }
