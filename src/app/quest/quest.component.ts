import { staggerTile } from '../shared/animations';
import { Component, OnInit } from '@angular/core';
import { QuestService } from './quest.service';
import { UserService, IQuest } from '../shared/user/user.service';
import { Quest } from './quest';
import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../shared/shared.module';


@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
  animations: [staggerTile]
})
export class QuestComponent implements OnInit {

  public quest$: Observable<IQuest>;
  public questGroup: Quest;
  constructor(private userS: UserService, private questS: QuestService) {
  }

  ngOnInit() {
    this.quest$ = this.userS.quest;
    this.questGroup = this.questS.questGroup;
  }

  public valueWithSpace(values: number) {
    return SharedModule.calculeMoneyWithSpace(values);
  }

}
