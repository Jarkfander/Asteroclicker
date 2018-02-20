import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryDirective } from './story.directive';
import { StoryService } from './story.service';
import { StoryTellerComponent } from './story-teller/story-teller.component';
import { StoryStateComponent } from './story-state/story-state.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StoryDirective, StoryTellerComponent, StoryStateComponent],
  exports: [StoryDirective, StoryTellerComponent, StoryStateComponent],
  providers: [StoryService]
})
export class StoryModule { }
