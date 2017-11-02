import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SharedModule} from '../shared/shared.module';
import { UserService } from '../user/user.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SigninComponent
  ],
  declarations: [SigninComponent],
  providers: [UserService]
})
export class SigninModule { }
