import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsteroidViewComponent } from './asteroid-view/asteroid-view.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { SharedModule } from '../shared/shared.module';
import { UserService } from '../shared/user/user.service';
import { SocketService } from '../shared/socket/socket.service';
import { FormsModule } from '@angular/forms';
import { AsteroidService } from './asteroid.service';
import { OreService } from '../ore/ore.service';
import { AsteroidMiningComponent } from './asteroid-mining/asteroid-mining.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
  ],
  declarations: [AsteroidViewComponent, AsteroidMiningComponent],
  exports: [AsteroidViewComponent, AsteroidMiningComponent],
  providers: [UserService, SocketService, OreService, AsteroidService]
})
export class AsteroidModule { }
