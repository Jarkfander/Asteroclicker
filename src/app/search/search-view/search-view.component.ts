import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { Research } from '../../ship/upgrade-class/research';
import { UpgradeService } from '../../ship/upgrade.service';
import { Utils } from '../../shared/utils';
import { User } from '../../shared/user/user';
import { SocketService } from '../../shared/socket/socket.service';
import { ISearch, SearchService } from '../search.service';
import { ResourcesService } from '../../shared/resources/resources.service';
import { NgSliderComponent } from './../../shared/ng-slider/ng-slider.component';

import { staggerTile } from './../../shared/animations';

export enum searchState {
    launchSearch,
    searching,
    chooseAsteroid,
    traveling
}

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss'],
  animations: [staggerTile]
})
export class SearchViewComponent implements OnInit {

  @ViewChild(NgSliderComponent) slider: NgSliderComponent;
  public search: ISearch;
  public distance: number;
  public searchTime: string;
  public timer: number;
  public isModalOpen: boolean;
  public researchInfo: Research;

  constructor(private userS: UserService,
              private resourcesS: ResourcesService,
              private socketS: SocketService,
              private searchS: SearchService) {
  }

  ngOnInit() {
    this.researchInfo = new Research(1, 1, 1, 1, 100000, 1);
    this.distance = this.researchInfo.minDistance;

    this.searchS.search
      .do((search: ISearch) => this.slider.slideTo(search.state))
      .do((search: ISearch) => this.timer = search.timer)
      .subscribe((searchResult: ISearch) => this.search = searchResult);

    this.userS.getUpgradeByName('research').subscribe((upgrade: IUserUpgrade) => {
      this.researchInfo = this.resourcesS.research[upgrade.lvl];
      this.searchTimeUpdate(this.distance);
    });

    this.searchTimeUpdate(this.distance);
    setInterval(() => { this.updateTimer(); }, 1000);

  }

  /**
   * DISTANCE
   */
  /** Launch search asteroid */
  public searchNewAster() {
    this.socketS.searchAsteroid(this.userS.currentUser.uid);
  }
  /** Set distance and estimated time for searching */
  public searchTimeUpdate(distance: number) {
    this.distance = distance;
    const coefDist = (((distance - this.researchInfo.minDistance) / (this.researchInfo.maxDistance - this.researchInfo.minDistance)) * 5) + 1;
    this.searchTime = Utils.secondsToHHMMSS((this.researchInfo.searchTime) * coefDist);
  }
  /**
   * RESULT
   */
  /** Open the modal for results */
  public showResult() {
    this.isModalOpen = true;
  }
  /** Close the modal of results */
  public closeModal() {
    this.isModalOpen = false;
  }
  /** Look for new asteroids */
  public rejectResults() {
    this.socketS.rejectResults(this.userS.currentUser.uid);
  }

  /**
   * SEARCHING && TRAVELLING
   */
  /** If searching or travelling update timer */
  private updateTimer() {
    if (!this.search || this.search.start === 0) { return; }
    if (this.search.state === 1 || this.search.state === 3) {
      console.log(this.timer);
      this.socketS.updateAsteroidTimer(this.userS.currentUser.uid, this.distance);
    }
  }










}
