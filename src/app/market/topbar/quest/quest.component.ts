import { Component, AfterViewInit } from '@angular/core';
import { QuestService } from '../quest.service';
import { UserService } from '../../../shared/user/user.service';


@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss']
})
export class QuestComponent implements AfterViewInit {

  constructor(private userS: UserService, private questS: QuestService) {
  }

  ngAfterViewInit(): void {
  }

}
