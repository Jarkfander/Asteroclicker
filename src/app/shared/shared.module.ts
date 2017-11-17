import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxDirective } from './lightbox.directive';
import { ModalComponent } from './modal/modal.component';
import { QuestComponent } from '../topbar/quest/quest.component';
import { RankingComponent } from '../topbar/ranking/ranking.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LightboxDirective,
    ModalComponent,
    QuestComponent,
    RankingComponent
  ],
  declarations: [LightboxDirective, ModalComponent, QuestComponent, RankingComponent]
})
export class SharedModule { }
