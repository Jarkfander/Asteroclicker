import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { SharedModule} from '../shared/shared.module';
import { UserService } from '../user/user.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    TopbarComponent
  ],
  declarations: [TopbarComponent],
  providers: [UserService]
})
export class TopbarModule { }
