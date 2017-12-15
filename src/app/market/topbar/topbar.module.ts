import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { SharedModule} from '../../shared/shared.module';
import { QuestService } from './quest.service';
import { UserService } from '../../shared/user/user.service';
import { QuestModule } from './quest/quest.module';
import { RankingModule } from './ranking/ranking.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    QuestModule,
    RankingModule
  ],
  exports: [
    TopbarComponent
  ],
  declarations: [TopbarComponent],
  providers: [UserService, QuestService]
})
export class TopbarModule { }
