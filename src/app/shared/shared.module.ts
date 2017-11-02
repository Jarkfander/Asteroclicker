import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxDirective } from './lightbox.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LightboxDirective
  ],
  declarations: [LightboxDirective]
})
export class SharedModule { }
