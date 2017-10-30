import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsteroidViewComponent } from './asteroid-view/asteroid-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AsteroidViewComponent],
  exports: [AsteroidViewComponent],
})
export class AsteroidModule { }
