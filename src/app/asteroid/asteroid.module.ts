import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsteroidViewComponent } from './asteroid-view/asteroid-view.component';
import { UserService } from '../user/user.service';
import { MiningPanelComponent } from './mining-panel/mining-panel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AsteroidViewComponent, MiningPanelComponent],
  exports: [AsteroidViewComponent],
  providers: [UserService]
})
export class AsteroidModule { }
