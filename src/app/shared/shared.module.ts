import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { QuestComponent } from '../market/topbar/quest/quest.component';
import { RankingComponent } from '../market/topbar/ranking/ranking.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    QuestComponent,
    RankingComponent
  ],
  declarations: [ModalComponent, QuestComponent, RankingComponent]
})
export class SharedModule { }
