import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AsteroidModule } from './asteroid/asteroid.module';
import { ShipModule } from './ship/ship.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { UserService } from './user/user.service';
import { SigninModule } from './signin/signin.module';
import { TopbarModule } from './topbar/topbar.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { UpgradeService } from './upgrade/upgrade.service';
import { MarketModule } from './market/market.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AsteroidModule,
    ShipModule,
    SigninModule,
    TopbarModule,
    SharedModule,
    MarketModule,
  ],
  providers: [UserService,UpgradeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
