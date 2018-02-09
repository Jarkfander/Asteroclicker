import { BoostService } from './boost.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostViewComponent } from './boost-view/boost-view.component';
import { BoostListComponent } from './boost-list/boost-list.component';
import { BoostStoreComponent } from './boost-store/boost-store.component';
import { BoostInventoryComponent } from './boost-inventory/boost-inventory.component';
import { BoostComponent } from './boost/boost.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BoostViewComponent,
    BoostListComponent,
    BoostStoreComponent,
    BoostInventoryComponent,
    BoostComponent
  ],
  exports: [
    BoostComponent
  ],
  providers: [BoostService]
})
export class BoostModule { }
