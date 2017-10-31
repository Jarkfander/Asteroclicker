import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsteroidViewComponent } from './asteroid-view/asteroid-view.component';
import { UserService } from '../user/user.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AsteroidViewComponent],
  exports: [AsteroidViewComponent],
  providers: [UserService]
})
export class AsteroidModule { }
