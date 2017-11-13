import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxDirective } from './lightbox.directive';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LightboxDirective,
    ModalComponent
  ],
  declarations: [LightboxDirective, ModalComponent]
})
export class SharedModule { }
