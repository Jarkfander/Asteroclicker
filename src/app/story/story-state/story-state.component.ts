import { StoryService } from './../story.service';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

import { takeWhile, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

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
    this.renderer.setStyle(this.el, 'width', `${el.getBoundingClientRect().width}px`);
    this.renderer.setStyle(this.el, 'height', `${el.getBoundingClientRect().height}px`);
    this.renderer.setStyle(this.el, 'top', `${el.getBoundingClientRect().top}px`);
    this.renderer.setStyle(this.el, 'left', `${el.getBoundingClientRect().left}px`);
  }

  ngOnInit() {
    this.el = this.elRef.nativeElement;
    this.storyS.el$.pipe(
      takeWhile((el: HTMLElement) => !!el)
    ).subscribe((el: HTMLElement) => this.setPosition(el));


  }

}
