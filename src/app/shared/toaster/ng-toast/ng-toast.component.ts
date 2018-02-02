import { Component, HostListener, AfterViewInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Toast } from '../models/toast';

import { Observable } from 'rxjs/Observable';
import { tap, filter, take, switchMap } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { enter } from './ng-toast.animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ng-toast',
  templateUrl: './ng-toast.component.html',
  styleUrls: ['./ng-toast.component.scss'],
  animations: [enter]
})
export class NgToastComponent implements AfterViewInit {

  @Input() toast: Toast;

  @Output() timeout = new EventEmitter<boolean>();
  @Output() clicked = new EventEmitter<MouseEvent>();

  @ViewChild('sliderRef') sliderRef: ElementRef;

  constructor(private renderer: Renderer2) { }

  @HostListener('click') onClick() {
    this.toast.click();
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.toast.hover(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.toast.hover(false);
  }

  ngAfterViewInit() {
    this.startTimer();
  }

  /** Start the timer */
  private startTimer() {
    let timeLeft = this.toast.timer;
    interval(10).pipe(
      switchMap(() => this.toast.onHover),
      filter((isHover: boolean) => !isHover),
      tap(() => timeLeft -= 10),
      tap(() => {
        const left = ((this.toast.timer - timeLeft) / this.toast.timer) * 100;
        this.renderer.setStyle(this.sliderRef.nativeElement, 'transform', `translateX(${left}%)`);  
      }),
      filter(() => timeLeft <= 0),
      take(1)
    ).subscribe(() => this.toast.remove());
  }
}
