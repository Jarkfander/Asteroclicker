import { Directive, ElementRef, Renderer2, Input, OnInit, HostListener } from '@angular/core';
import { StoryService } from './story.service';

import { map, tap, takeWhile } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';

@Directive({
  selector: '[story]'
})
export class StoryDirective implements OnInit {

  @Input() set story(state: string) {
    this.storyState = parseInt(state, 10);
  }
  private storyState: number;
  private el: HTMLElement;
  private clickable: boolean;

  constructor(private elRef: ElementRef,
              private renderer: Renderer2,
              private storyS: StoryService) { }
  
  @HostListener('click', ['$event']) onclick() {
    if (this.clickable) { this.storyS.nextState(); }
  }

  private isLocked() {
    this.clickable = false;
    this.renderer.setStyle(this.el, 'filter', 'grayscale(1)');
    this.renderer.setStyle(this.el, 'pointerEvents', 'none');
  }

  private isClickable() {
    this.clickable = true;
    let alternate = false;
    interval(1000).pipe(
      takeWhile(() => this.clickable),
      tap(() => alternate = !alternate)
    ).subscribe(() => this.renderer.setStyle(this.el, 'filter', `brightness(${alternate ? 100 : 140}%)`));
    this.renderer.setStyle(this.el, 'cursor', 'pointer');
    // Remove previous styles
    this.renderer.setStyle(this.el, 'pointerEvents', 'auto');
  }

  private isActive() {
    this.clickable = false;
    this.renderer.setStyle(this.el, 'filter', '');
    // Remove previous styles    
    this.renderer.setStyle(this.el, 'cursor', 'auto');
    this.renderer.setStyle(this.el, 'pointerEvents', 'auto');
  }

  ngOnInit() {
    this.el = this.elRef.nativeElement;
    this.renderer.setStyle(this.el, 'transition', 'filter 1s ease-in-out');
    
    this.storyS.state$.subscribe((state: number) => {
      if (state < this.storyState) {
        this.isLocked();
      } else if (state === this.storyState) {
        this.storyS.nextEl(this.el);
        this.isActive();
      } else {
        this.isActive();
      }
    });
  }
}
