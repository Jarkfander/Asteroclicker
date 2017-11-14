import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { Quest } from './quest';
import { UserService } from '../user/user.service';

@Injectable()
export class QuestService {
  db: AngularFireDatabase;
  questTab: Array<Quest>;

  constructor(db: AngularFireDatabase, private userS: UserService) {
    this.db = db;
    this.questTab = new Array<Quest>();

    this.db.object('quest').valueChanges().take(1).subscribe(
      (snapshot: any) => {
        this.FillQuest(snapshot);
        // this.randomQuestUser();
    });
  }

  FillQuest(snapshot) {
    for (let i = 0 ; i < snapshot.length ; i++) {
      this.questTab.push(new Quest(snapshot[i].name, snapshot[i].type, snapshot[i].values, i, snapshot[i].gain));
    }
  }

  public randomQuestUser() {
    const randomQuest = Math.floor((Math.random() * this.questTab.length));
    this.userS.randomQuestUser(this.questTab[randomQuest]);
  }
}
