import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Ranking } from './ranking';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../shared/user/user.service';

@Injectable()
export class RankingService {
  db: AngularFireDatabase;
  rankingTab: Array<Ranking>;
  rankSubject = new Subject<Array<Ranking>>();
  

  constructor(db: AngularFireDatabase, private userS: UserService) {
    this.db = db;
    this.rankingTab = new Array<Ranking>();

    this.db.object('ranking').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillRank(snapshot);
    });
    this.db.object('ranking').valueChanges().subscribe(
    (snapshot: any) => {
        this.FillRank(snapshot);
    });
  }

  FillRank(snapshot) {
    this.rankingTab = [];
    for (let i = 0 ; i < snapshot.length ; i++) {
      this.rankingTab.push(new Ranking(snapshot[i].name, snapshot[i].score, i));
    }
    this.rankSubject.next(this.rankingTab);
  }
}
