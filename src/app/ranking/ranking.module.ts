import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { UserService } from '../shared/user/user.service';
import { RankingService } from './ranking.service';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    RankingComponent
  ],
  declarations: [RankingComponent],
  providers: [UserService, RankingService]
})
export class RankingModule { }
