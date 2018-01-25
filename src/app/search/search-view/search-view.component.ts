import { Component, OnInit } from '@angular/core';
import { UserService, IFrenzyInfo, IUpgrades } from '../../shared/user/user.service';
import { Research } from '../../ship/upgrade-class/research';
import { UpgradeService } from '../../ship/upgrade.service';
import { Utils } from '../../shared/utils';
import { User } from '../../shared/user/user';
import { SocketService } from '../../shared/socket/socket.service';
import { ISearch, SearchService } from '../search.service';
import { SearchModule } from '../search.module';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {


  public researchInfo: Research;

  public searchTime: string;

  public distance: number = 0;

  public search: ISearch = {
    result: [],
    start: 0,
    timer: 0
  };

  public isModalOpen: boolean = false;

  public timer: string = "00:00:00";


  constructor(private userS: UserService, private upgradeS: UpgradeService
    , private socketS: SocketService, private searchS: SearchService) {
  }

  ngOnInit() {

    this.searchS.search.subscribe((searchResult: ISearch) => {
      this.search = searchResult;
      this.timer = Utils.secondsToHHMMSS(this.search.timer / 1000);
      if (searchResult.result.length !== 3) {
        this.isModalOpen = false;
      }
    });

    this.researchInfo = new Research(1, 1, 1, 1, 100000, 1, 1);
    this.distance = this.researchInfo.maxDistance / 2;

    this.userS.upgrade.subscribe((upgrade: IUpgrades) => {
      this.researchInfo = this.upgradeS.research[upgrade.research.lvl];
      this.searchTimeUpdate();
    });

    this.searchTimeUpdate();
    setInterval(() => { this.updateTimer(); }, 1000);

  }

  updateTimer() {
    if (this.search.start !== 0) {
      if (this.search.result.length === undefined || this.search.result.length === 1) {
        this.socketS.updateAsteroidTimer(this.userS.currentUser.uid, this.distance);
      }
    }
  }

  searchTimeUpdate() {
    const coefDist = (((this.distance - this.researchInfo.minDistance) /
      (this.researchInfo.maxDistance - this.researchInfo.minDistance)) * 5) + 1;
    this.searchTime = Utils.secondsToHHMMSS((this.researchInfo.searchTime) * coefDist);
  }

  searchNewAster() {
    this.socketS.searchAsteroid(this.userS.currentUser.uid);
  }

  rejectResults() {
    this.socketS.rejectResults(this.userS.currentUser.uid);
  }

  showResult() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
