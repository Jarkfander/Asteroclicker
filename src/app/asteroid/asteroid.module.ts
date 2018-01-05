import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsteroidViewComponent } from './asteroid-view/asteroid-view.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { SharedModule } from '../shared/shared.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { InfosViewComponent, SortPipe } from './infos-list/infos-list.component';
import { OreInfosViewComponent } from './ore-info-view/ore-infos-view.component';
import { UserService } from '../shared/user/user.service';
import { UpgradeService } from '../ship/upgrade-list/upgrade.service';
import { SocketService } from '../shared/socket/socket.service';
import { OreInfoService } from './ore-info-view/ore-info.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [AsteroidViewComponent, InfosViewComponent, SearchResultComponent, OreInfosViewComponent,SortPipe],
  exports: [AsteroidViewComponent, InfosViewComponent, SortPipe],
  providers: [UserService, UpgradeService, SocketService, OreInfoService]
})
export class AsteroidModule { }
