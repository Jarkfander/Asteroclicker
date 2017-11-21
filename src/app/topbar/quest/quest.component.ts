import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { QuestService } from '../quest.service';


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
