import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsteroidViewComponent } from './asteroid-view/asteroid-view.component';
import { UserService } from '../user/user.service';
import { MiningPanelComponent } from './mining-panel/mining-panel.component';
import { InfosViewComponent } from './infos-view/infos-view.component';
import { UpgradeService } from '../upgrade/upgrade.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AsteroidViewComponent, InfosViewComponent, MiningPanelComponent],
  exports: [AsteroidViewComponent, InfosViewComponent],
  providers: [UserService, UpgradeService]
})
export class AsteroidModule { }
