import { Component, OnInit } from '@angular/core';
import { IStoryState, story } from '../story';
import { Observable } from 'rxjs/Observable';
import { StoryService } from '../story.service';

import { map } from 'rxjs/operators';

@Component({
  selector: 'story-teller',
  templateUrl: './story-teller.component.html',
  styleUrls: ['./story-teller.component.scss']
})
export class StoryTellerComponent implements OnInit {

  public story$: Observable<string>;

  constructor(private storyS: StoryService) { }

  public next() {
    this.storyS.nextState();
  }

  ngOnInit() {
    this.story$ = this.storyS.state$.pipe(
      map((state: number) => story[state])
    );
  }

}
