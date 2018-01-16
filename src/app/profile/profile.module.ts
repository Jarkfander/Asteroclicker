import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';

import { FormsModule } from '@angular/forms';
import { UserService } from '../shared/user/user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ProfileComponent
  ],
  declarations: [ProfileComponent],
  providers: [UserService]
})
export class ProfileModule { }
