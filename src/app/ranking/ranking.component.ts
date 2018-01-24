import { Component, AfterViewInit } from '@angular/core';
import { Ranking } from './ranking';
import { UserService, IUser, IProfile } from '../shared/user/user.service';
import { RankingService } from './ranking.service';



@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements AfterViewInit {

  ranking: Array<Ranking>;
  rankingBtw: Array<Ranking>;
  iUser: number;
  nameUser: string;

  constructor(private userS: UserService, private rankingS: RankingService) {
  }

  ngAfterViewInit(): void {
    this.ranking = new Array<Ranking>();
    this.ranking = this.rankingS.rankingTab;
    this.userS.profile.subscribe((profile: IProfile) => {
      this.nameUser = profile.name;
      this.searchPlayerRanking();

    });
    this.rankingS.rankSubject.subscribe((ranking) => {
      this.ranking = ranking;
      this.searchPlayerRanking();
    });
  }

  searchPlayerRanking() {
    this.rankingBtw = new Array<Ranking>();
    for (let i = 0; i < this.ranking.length; i++) {
      if (this.nameUser === this.ranking[i].name) {
        this.iUser = i + 1;
        break;
      }
    }
    const baseUser = this.iUser - this.iUser % 10;
    for (let i = baseUser; i < baseUser + 10; i++) {
      if (!this.ranking[i]) {
        break;
      }
      this.rankingBtw.push(this.ranking[i]);
    }
  }


}
