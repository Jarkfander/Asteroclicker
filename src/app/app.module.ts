import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AsteroidModule } from './asteroid/asteroid.module';
import { ShipModule } from './ship/ship.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AsteroidModule,
    ShipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
