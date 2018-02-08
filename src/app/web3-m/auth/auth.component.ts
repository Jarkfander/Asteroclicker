import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Web3Service } from '../web3.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements AfterViewInit {

  @ViewChild('iframe') iframe: ElementRef

  private window: Window;

  constructor(private web3S: Web3Service) { }

  @HostListener('window:message', ['$event']) receiveMessage(event: MessageEvent) {
    if (environment.authClient !== event.origin) { return; }
    const data = JSON.parse(event.data);
    switch (data.header) {
      case ('address'): {
        this.web3S.addressSubject.next(data.value);
        break;
      }
    }
  }

  ngAfterViewInit() {
    this.iframe.nativeElement.src = environment.authClient;
    this.iframe.nativeElement.onLoad = () => {
      this.web3S.authWindow = this.iframe.nativeElement.contentWindow;
      this.web3S.sendData({
        header: 'connectionFrom',
        value: environment.clientId
      });
    }
  }
}
