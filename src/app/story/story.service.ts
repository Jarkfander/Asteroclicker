import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StoryService {

  private stateSubject = new BehaviorSubject<number>(0);
  private elSubject = new Subject<HTMLElement>();
  public state$: Observable<number>;
  public el$: Observable<HTMLElement>;

  constructor() {
    this.state$ = this.stateSubject.asObservable();
    this.el$ = this.elSubject.asObservable();
  }

  public nextState() {
    this.stateSubject.next(this.stateSubject.getValue() + 1);
  }
  public nextEl(el: HTMLElement) {
    this.elSubject.next(el);
  }
}
