import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgToastComponent } from '../ng-toast/ng-toast.component';
import { IToastOptions, IToast, Toast } from './../models/toast';
import { ToasterService } from '../toaster.service';

import { Observable } from 'rxjs/Observable';
import { switchMap, take, tap } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'ng-toaster',
  templateUrl: './ng-toaster.component.html',
  styleUrls: ['./ng-toaster.component.scss']
})
export class NgToasterComponent implements OnInit {

  public toasts$: Observable<Toast[]>;
  public success = this.toasterS.success;
  public alert = this.toasterS.alert;
  public error = this.toasterS.error;

  @ViewChildren(NgToastComponent) toasts: QueryList<NgToastComponent>;

  constructor(private toasterS: ToasterService) {}

  ngOnInit() {
    this.toasts$ = this.toasterS.toasts$;
  }

}
