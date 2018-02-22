import { Component, OnInit } from '@angular/core';
import { IStoryState, story } from '../story';
import { Observable } from 'rxjs/Observable';
import { StoryService } from '../story.service';

import { map, tap } from 'rxjs/operators';
import { SocketService } from '../../shared/socket/socket.service';

@Component({
  selector: 'story-teller',
  templateUrl: './story-teller.component.html',
  styleUrls: ['./story-teller.component.scss']
})
export class StoryTellerComponent implements OnInit {

  public story$: Observable<string>;
  public hasOk: boolean;
  private okList = [5, 7, 8, 9, 10, 11, 12, 13];


  private step: number;

  constructor(private storyS: StoryService,
    private socketS: SocketService) { }

  ngOnInit() {
    this.story$ = this.storyS.state$.pipe(
      tap((state: number) => this.step = state),
      tap((state: number) => this.hasOk = this.okList.indexOf(state) !== -1),
      map((state: number) => story[state])
    );

  }
  public next() {
    console.log();
    this.socketS.nextStep(this.step + 1);
  }

}
