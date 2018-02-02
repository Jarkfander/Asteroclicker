import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Toast, IToastOptions } from './models/toast';

import { mergeMap, reduce, filter, map, take, tap } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

@Injectable()
export class ToasterService {

  public toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]>;

  constructor() {
    this.toasts$ = this.toastsSubject.asObservable();
  }

  /** Add a toast to the list of toast */
  private add(toast: Toast): Toast {
    this.toastsSubject.next([...this.toastsSubject.getValue(), toast]);
    toast.onRemove.pipe(take(1))
      .subscribe((toastRemoved: Toast) => this.remove(toastRemoved.id));
    return toast;
  }


  /** Remove one toast from the toaster */
  private remove(id: string) {
    this.toasts$.pipe(
      take(1),
      mergeMap((toasts: Toast[]) => toasts),
      filter((toast: Toast) => toast.id !== id),
      reduce((acc: Toast[], curr: Toast) => acc = [...acc, curr], []),
      // tap((toasts) => console.log(toasts)),
      // map((toasts: Toast[]) => toasts.splice(toasts.map(toast => toast.id).indexOf(id), 1))
    ).subscribe((toasts: Toast[]) => this.toastsSubject.next([...toasts]));
  }

  /** Clear the array of items */
  public removeAll() {
    this.toastsSubject.next([]);
  }

  /** Create a success toast */
  public success(title: string, content?: string, options?: IToastOptions): Toast {
    return this.add(new Toast('success', title, content, options));
  }

  /** Create an alert toast */
  public alert(title: string, content?: string, options?: IToastOptions): Toast {
    return this.add(new Toast('alert', title, content, options));
  }

  /** Create an error toast */
  public error(title: string, content?: string, options?: IToastOptions): Toast {
    return this.add(new Toast('error', title, content, options));
  }
}
