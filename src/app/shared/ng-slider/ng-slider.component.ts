import { Component, ElementRef, Renderer2, ViewChild, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'ng-slide',
  template: '<ng-content></ng-content>',
  styles: [':host{position: relative; flex-shrink: 0; height: 100%}']
})
export class NgSlideComponent {

  constructor() { }
}

@Component({
  selector: 'ng-slider',
  templateUrl: './ng-slider.component.html',
  styleUrls: ['./ng-slider.component.scss']
})
export class NgSliderComponent implements AfterViewInit {

  @Input() background: string;
  @ViewChild('slidesRef') slidesRef: ElementRef;
  private slides: HTMLElement;
  private slidesCount: number;
  public index = 0;

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  private slide() {
    this.renderer.setStyle(this.slides, 'transform', `translateX(-${this.index * 100 / this.slidesCount}%)`);
  }

  public slideNext() {
    if (this.index === this.slidesCount) { return; }
    this.index++;
    this.slide();
  }

  public slidePrev() {
    if (this.index === 0) { return; }
    this.index--;
    this.slide();
  }

  public slideTo(index: number) {
    if (index < 0 || index > this.slidesCount) { return; }
    this.index = index;
    this.slide();
  }

  ngAfterViewInit() {
    this.slides = this.slidesRef.nativeElement;
    this.slidesCount = this.slides.childElementCount;
    this.renderer.setStyle(this.slides, 'width', `${this.slidesCount * 100}%`);
    for (let i = 0; i < this.slidesCount; i++) {
      const child = this.slides.children[i];
      this.renderer.setStyle(child, 'width', `${100 / this.slidesCount}%`);
    }
    this.renderer.setStyle(this.slides, 'backgroundImage', `url(${this.background})`);
  }
}
