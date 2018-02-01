import { Component, AfterViewInit, Input, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ng-progress',
  templateUrl: './ng-progress.component.html',
  styleUrls: ['./ng-progress.component.scss']
})
export class NgProgressComponent implements AfterViewInit {

  private progressBar: HTMLElement;

  @Input() color: string;
  @Input() total: number;
  @Input() set current(current: number) {
    if (!this.progressBar) { return; }
    const x = Math.floor(((this.total - current) / this.total) * 100);
    this.renderer.setStyle(this.progressBar, 'transform', `translateX(-${x}%)`);
  }

  @ViewChild('progress') progressRef: ElementRef;
  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.progressBar = this.progressRef.nativeElement;
    this.renderer.setStyle(this.progressBar, 'backgroundColor', this.color);
  }

}
