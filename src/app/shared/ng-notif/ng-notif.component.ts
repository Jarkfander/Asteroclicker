import { Component, OnInit, ViewChild } from '@angular/core';
import { SimpleNotificationsComponent, NotificationsService, Notification } from 'angular2-notifications';

@Component({
  selector: 'ng-notif',
  templateUrl: './ng-notif.component.html',
  styleUrls: ['./ng-notif.component.scss']
})
export class NgNotifComponent implements OnInit {

  @ViewChild(SimpleNotificationsComponent) private notif: SimpleNotificationsComponent;

  constructor(private service: NotificationsService) { }

  /** Open a success notification */
  public success(title: string, content?: string): Notification {
    return this.service.success(title, content, {
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
  }

  /** Open an alert notification */
  public alert(title: string, content: string): Notification {
    return this.service.bare(title, content, {
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      icons: 'Clock',
      theClass: 'alert-notif'
    });
  }

  /** Open an error notification */
  public error(title: string, content: string): Notification {
    return this.service.bare(title, content, {
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      icons: 'Exclamation Point',
      theClass: 'error-notif'
    });
  }

  ngOnInit() {
  }

}
