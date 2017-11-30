import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketInfoComponent } from './market-view/market-view.component';
import { ChartsModule } from 'ng2-charts';
import { MarketService } from './market.service';
import { UserService } from '../shared/user/user.service';
import { MarketViewComponent } from './market-list/market-list.component';


@NgModule({
  imports: [
    CommonModule,
    ChartsModule
  ],
  declarations: [MarketViewComponent, MarketInfoComponent],
  exports: [MarketViewComponent],
  providers: [UserService, MarketService]
})
export class MarketModule { }
