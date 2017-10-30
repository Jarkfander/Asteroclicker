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


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AsteroidModule,
    ShipModule,
    SigninModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
