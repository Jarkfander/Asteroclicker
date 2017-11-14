import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxDirective } from './lightbox.directive';
import { ModalComponent } from './modal/modal.component';
import { QuestComponent } from '../topbar/quest/quest.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LightboxDirective,
    ModalComponent,
    QuestComponent
  ],
  declarations: [LightboxDirective, ModalComponent, QuestComponent]
})
export class SharedModule { }
