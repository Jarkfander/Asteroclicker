import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketViewComponent } from './market-view/market-view.component';
import { UserService } from '../user/user.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MarketViewComponent],
  exports: [MarketViewComponent],
  providers:[UserService]
})
export class MarketModule { }
