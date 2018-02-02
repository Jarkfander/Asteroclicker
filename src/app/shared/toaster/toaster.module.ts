import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgToasterComponent } from './ng-toaster/ng-toaster.component';
import { NgToastComponent } from './ng-toast/ng-toast.component';
import { ToasterService } from './toaster.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  declarations: [NgToasterComponent, NgToastComponent],
  exports: [NgToasterComponent],
  providers: [ToasterService]
})
export class ToasterModule { }
