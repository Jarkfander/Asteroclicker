import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { QuestModule } from '../quest/quest.module';
import { RankingModule } from '../ranking/ranking.module';
import { ProfileModule } from '../profile/profile.module';
import { TopbarComponent } from './topbar.component';
import { UserService } from '../shared/user/user.service';
import { QuestService } from '../quest/quest.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    QuestModule,
    RankingModule,
    ProfileModule
  ],
  exports: [
    TopbarComponent
  ],
  declarations: [TopbarComponent],
  providers: [UserService, QuestService]
})
export class TopbarModule { }
