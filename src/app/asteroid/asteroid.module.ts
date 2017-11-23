import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsteroidViewComponent } from './asteroid-view/asteroid-view.component';
import { UserService } from '../user/user.service';
import { MiningPanelComponent } from './mining-panel/mining-panel.component';
import { InfosViewComponent } from './infos-view/infos-view.component';
import { UpgradeService } from '../upgrade/upgrade.service';
import { SocketService } from '../socket/socket.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { SharedModule } from '../shared/shared.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { OreInfoService } from './ore-info.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [AsteroidViewComponent, InfosViewComponent, MiningPanelComponent, SearchResultComponent],
  exports: [AsteroidViewComponent, InfosViewComponent],
  providers: [UserService, UpgradeService, SocketService, OreInfoService]
})
export class AsteroidModule { }
