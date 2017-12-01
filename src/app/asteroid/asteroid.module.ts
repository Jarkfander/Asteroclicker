import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsteroidViewComponent } from './asteroid-view/asteroid-view.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { SharedModule } from '../shared/shared.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { InfosViewComponent } from './infos-list/infos-list.component';
import { OreInfosViewComponent } from './ore-infos-view/ore-infos-view.component';
import { UserService } from '../shared/user/user.service';
import { UpgradeService } from '../ship/upgrade-list/upgrade.service';
import { SocketService } from '../shared/socket/socket.service';
import { OreInfosService } from './ore-infos-view/ore-infos.service';
import { MiningPanelComponent } from './mining-panel/mining-panel.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AsteroidViewComponent,
    InfosViewComponent,
    SearchResultComponent,
    OreInfosViewComponent,
    MiningPanelComponent,
    SearchPanelComponent
  ],
  exports: [AsteroidViewComponent, InfosViewComponent],
  providers: [UserService, UpgradeService, SocketService, OreInfosService]
})
export class AsteroidModule { }
