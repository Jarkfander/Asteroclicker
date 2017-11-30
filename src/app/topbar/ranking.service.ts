import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Ranking } from './ranking';
import { UserService } from '../shared/user/user.service';

@Injectable()
export class RankingService {
  db: AngularFireDatabase;
  rankingTab: Array<Ranking>;

  constructor(db: AngularFireDatabase, private userS: UserService) {
    this.db = db;
    this.rankingTab = new Array<Ranking>();

    this.db.object('ranking').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillQuest(snapshot);
    });
  }

  FillQuest(snapshot) {
    for (let i = 0 ; i < snapshot.length ; i++) {
      this.rankingTab.push(new Ranking(snapshot[i].name, snapshot[i].score, i));
    }
  }
}
