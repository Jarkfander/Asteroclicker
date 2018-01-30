import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'ng-slide',
  template: '<ng-content></ng-content>',
  styles: [':host{position: relative; flex-shrink: 0; width: 100%; height: 100%}']
})
export class NgSlideComponent {

  constructor() { }
}

@Component({
  selector: 'ng-slider',
  templateUrl: './ng-slider.component.html',
  styleUrls: ['./ng-slider.component.scss']
})
export class NgSliderComponent {

  @ViewChild('slides') slides: ElementRef;
  public index = 0;

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  private slide() {
    this.renderer.setStyle(this.slides.nativeElement, 'transform', `translateX(-${this.index * 100}%)`);
  }

  /** TODO : check amount of indexs */
  public slideNext() {
    this.index++;
    this.slide();
  }

  public slidePrev() {
    this.index--;
    this.slide();
  }

  public slideTo(index: number) {
    this.index = index;
    this.slide();
  }

}
