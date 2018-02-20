import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserService } from '../shared/user/user.service';

@Injectable()
export class StoryService {

  private elSubject = new Subject<HTMLElement>();
  public state$: Observable<number>;
  public el$: Observable<HTMLElement>;

  constructor(private db: AngularFireDatabase, private userS: UserService) {
    this.el$ = this.elSubject.asObservable();
    this.state$ = this.db.object<number>(`users/${this.userS.userId}/profile/step`).valueChanges<number>();
  }

  public nextEl(el: HTMLElement) {
    this.elSubject.next(el);
  }
}
