import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { RankingService } from '../ranking.service';
import { Ranking } from '../ranking';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements AfterViewInit {

  ranking: Array<Ranking>;
  constructor(private userS: UserService, private rankingS: RankingService) {
    this.ranking = new Array<Ranking>();
    this.ranking = rankingS.rankingTab;
  }

  ngAfterViewInit(): void {

  }

}
