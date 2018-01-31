import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Component
import { MarketListComponent } from './market-list/market-list.component';
import { CurveViewComponent } from './curve-view/curve-view.component';
import { MarketViewComponent } from './market-view/market-view.component';

// Providers
import { MarketService } from './market.service';
import { UserService } from '../shared/user/user.service';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    SharedModule,
    PerfectScrollbarModule,
    FormsModule
  ],
  declarations: [MarketViewComponent, MarketListComponent, CurveViewComponent],
  exports: [MarketViewComponent],
  providers: [UserService, MarketService]
})
export class MarketModule { }
