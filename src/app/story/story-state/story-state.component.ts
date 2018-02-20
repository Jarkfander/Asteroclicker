import { StoryService } from './../story.service';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

import { takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'story-state',
  templateUrl: './story-state.component.html',
  styleUrls: ['./story-state.component.scss']
})
export class StoryStateComponent implements OnInit {

  private el: HTMLElement;

  constructor(private elRef: ElementRef,
              private renderer: Renderer2,
              private storyS: StoryService) { }

  public setPosition(el: HTMLElement) {
    console.log(el);
    this.renderer.setStyle(this.el, 'width', `${el.offsetWidth}px`);
    this.renderer.setStyle(this.el, 'height', `${el.offsetHeight}px`);
    this.renderer.setStyle(this.el, 'top', `${el.offsetTop}px`);
    this.renderer.setStyle(this.el, 'left', `${el.offsetLeft}px`);
    console.log(this.el);
  }

  ngOnInit() {
    this.el = this.elRef.nativeElement;
    this.storyS.el$.pipe(
      takeWhile((el: HTMLElement) => !!el)
    ).subscribe((el: HTMLElement) => this.setPosition(el))
  }

}
