import { NotificationPermission } from './permission';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class NotifyService {

  private permission$: Observable<boolean>;

  constructor() {  }

  private requestPermission(notif: Notification): Observable<boolean> {
    return new NotificationPermission(notif);
  }


  public open(title: string, options?: any): Observable<Notification> {
    const notify = new Notification(title, options);
    return this.requestPermission(notify)
      .mergeMap(permission => {
        if (!permission) {
          return Observable.throw(new Error('Permission Denied: You do not have permission to open a notification.'));
        }

        return this.create(notify);
    });
  }

  private create(notification: Notification) {

    return new Observable((subscriber: Subscriber<Notification>) => {

      notification.onclick = () => subscriber.next(notification);
      notification.onerror = () => subscriber.error(notification);
      notification.onclose = () => subscriber.complete();

    });
  }
}
