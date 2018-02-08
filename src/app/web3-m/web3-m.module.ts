import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { NexiumService } from './nexium.service';
import { Web3Service } from './web3.service';
import Web3 from 'web3'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AuthComponent],
  exports: [AuthComponent],
  providers: [NexiumService, Web3Service]

})

export class Web3MModule {
}
