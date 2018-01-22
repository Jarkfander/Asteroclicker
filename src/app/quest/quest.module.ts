import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestComponent } from './quest.component';
import { UserService } from '../shared/user/user.service';
import { QuestService } from './quest.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    QuestComponent
  ],
  declarations: [QuestComponent],
  providers: [UserService, QuestService]
})
export class QuestModule { }
