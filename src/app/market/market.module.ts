import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketViewComponent } from './market-view/market-view.component';
import { UserService } from '../user/user.service';
import { ChartsModule } from 'ng2-charts';
import { MarketService } from './market.service';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule
  ],
  declarations: [MarketViewComponent],
  exports: [MarketViewComponent],
  providers: [UserService, MarketService]
})
export class MarketModule { }
