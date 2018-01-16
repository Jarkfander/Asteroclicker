import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../shared/shared.module';
import { SigninComponent } from './signin.component';
import { AuthService } from './auth.service';
import { SocketService } from '../shared/socket/socket.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SigninComponent
  ],
  declarations: [SigninComponent],
  providers: [AuthService, SocketService]
})
export class SigninModule { }
