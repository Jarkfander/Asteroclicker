import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { SharedModule} from '../shared/shared.module';
import { QuestService } from './quest.service';
import { UserService } from '../shared/user/user.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    TopbarComponent
  ],
  declarations: [TopbarComponent],
  providers: [UserService, QuestService]
})
export class TopbarModule { }
