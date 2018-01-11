import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../../shared/user/user.service';
import { FormsModule } from '@angular/forms';

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
