import { Directive, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';

@Directive({
  selector: '[lightbox]'
})
export class LightboxDirective {

  private w: number;
  private h: number;
  private x: number;
  private y: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousemove', ['$event']) onHover(e: MouseEvent) {
    const posX = 100 * (e.x - this.x) / this.w;
    const posY = 100 * (e.y - this.y) / this.y;
    const background =  `radial-gradient(circle at ${posX}% ${posY}%, rgba(50, 50, 50, 0.5), transparent)`;
    const border = `linear-gradient(to right, rgba(50, 50, 50, 0.5) ${posX - 20}%, rgb(100, 100, 100), rgba(50, 50, 50, 0.5) ${posX + 20}%) 10`;
    this.renderer.setStyle(this.el.nativeElement, 'backgroundImage', background);
    this.renderer.setStyle(this.el.nativeElement, 'borderImage', border);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundImage', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'borderImage', 'none');
  }

  ngAfterViewInit() {
    this.w = this.el.nativeElement.offsetWidth;
    this.h = this.el.nativeElement.offsetHeight;
    this.x = this.el.nativeElement.offsetLeft;
    this.y = this.el.nativeElement.offsetTop;
  }
}
