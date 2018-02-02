import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

/**
 * Ask Permission as an Observable
 */
export class NotificationPermission extends Observable<boolean> {
  constructor(notification?: Notification) {
    super((subscriber: Subscriber<boolean>) => {
      if (!notification || notification.permission === 'denied') {
        subscriber.next(false);
        subscriber.complete();
      } else if (notification.permission === 'granted') {
        subscriber.next(true);
        subscriber.complete();
      } else {
        Notification.requestPermission().then(permission => {
          subscriber.next(permission === 'granted');
          subscriber.complete();
        });
      }
    });
  }
}
