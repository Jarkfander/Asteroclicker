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

  private isLocked() {
    this.clickable = false;
    this.renderer.setStyle(this.el, 'filter', 'grayscale(1)');
    this.renderer.setStyle(this.el, 'pointerEvents', 'none');
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

    this.storyS.state$.pipe(
      takeWhile((state: number) => state <= this.storyState + 1))
    .subscribe((state: number) => {
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
