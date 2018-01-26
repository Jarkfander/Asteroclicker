import { entrance } from '../shared/animations';
import { Component, OnInit } from '@angular/core';
import { QuestService } from './quest.service';
import { UserService } from '../shared/user/user.service';
import { Quest } from './quest';


@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
  animations: [entrance]
})
export class QuestComponent implements OnInit {

  public quest: Quest;
  public questGroup: Quest;
  constructor(private userS: UserService, private questS: QuestService) {
  }

  ngOnInit() {
    this.quest = this.userS.currentUser.quest;
    this.questGroup = this.questS.questGroup;
  }

}
