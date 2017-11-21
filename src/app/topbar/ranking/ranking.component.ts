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
  rankingBtw: Array<Ranking>;
  iUser: number;

  constructor(private userS: UserService, private rankingS: RankingService) {
    this.ranking = new Array<Ranking>();
    this.ranking = rankingS.rankingTab;
    this.searchPlayerRanking();
  }

  ngAfterViewInit(): void {

  }

  searchPlayerRanking() {
    this.rankingBtw = new Array<Ranking>();
    for (let i = 0; i < this.ranking.length; i++) {
      if (this.userS.currentUser.email === this.ranking[i].name) {
        this.iUser = i;
        break;
      }
    }
    const baseUser = this.iUser - this.iUser % 10;
    for (let i = baseUser ; i < baseUser + 10 ; i++) {
      if (!this.ranking[i]) {
        break;
      }
      this.rankingBtw.push(this.ranking[i]);
    }
  }


}
