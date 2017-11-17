import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankingService } from '../ranking.service';
import { UserService } from '../../user/user.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RankingComponent],
  providers: [UserService, RankingService]
})
export class RankingModule { }
