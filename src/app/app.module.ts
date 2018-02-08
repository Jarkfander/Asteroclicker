import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AsteroidModule } from './asteroid/asteroid.module';
import { ShipModule } from './ship/ship.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { SigninModule } from './signin/signin.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { MarketModule } from './market/market.module';
import { MarketService } from './market/market.service';
import { UserService } from './shared/user/user.service';
import { TopbarModule } from './topbar/topbar.module';
import { UpgradeService } from './ship/upgrade.service';
import { QuestService } from './quest/quest.service';
import { RankingService } from './ranking/ranking.service';
import { AuthService } from './signin/auth.service';
import { OreModule } from './ore/ore.module';
import { SearchViewComponent } from './search/search-view/search-view.component';
import { SearchModule } from './search/search.module';
import { ResourcesService } from './shared/resources/resources.service';
import { ToasterModule } from './shared/toaster/toaster.module';
import { NexiumService } from './web3-m/nexium.service';
import { Web3MModule } from './web3-m/web3-m.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AsteroidModule,
    ShipModule,
    SigninModule,
    TopbarModule,
    SharedModule,
    MarketModule,
    OreModule,
    SearchModule,
    ToasterModule,
    Web3MModule
  ],
  providers: [UserService, UpgradeService, MarketService, QuestService, RankingService, AuthService, ResourcesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
