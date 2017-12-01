import { User } from './../../shared/user/user';
import { SocketService } from './../../shared/socket/socket.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { SearchResult } from '../search-result/SearchResult';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit, AfterViewInit {

  public search: SearchResult;
  public timer = '00:00:00';
  public isModalOpen: boolean;

  constructor(private userS: UserService, private socketS: SocketService) { }

  private updateTimer() {
    if (this.search.start !== 0) {

      if (this.search.results.length === 0 || this.search.results.length === 1) {
        this.socketS.updateAsteroidTimer();
      }
    }
  }

  private secondsToHHMMSS(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - (hours * 3600)) / 60);
    const seconds = Math.floor(time - (hours * 3600) - (minutes * 60));

    let out = hours < 10 ? '0' + hours : '' + hours;
    out += minutes < 10 ? ':0' + minutes : ':' + minutes;
    out += seconds < 10 ? ':0' + seconds : ':' + seconds;

    return out;
  }

  public searchNewAster() { this.socketS.searchAsteroid(); }
  public rejectResults() { this.socketS.rejectResults(); }
  public showResult() { this.isModalOpen = true; }
  public closeModal() { this.isModalOpen = false; }

  ngOnInit() {
    this.search = this.userS.currentUser.asteroidSearch;
  }

  ngAfterViewInit() {
    this.userS.searchSubject.subscribe((user: User) => {
      this.search = user.asteroidSearch;
      this.timer = this.secondsToHHMMSS(this.search.timer / 1000);
      if (user.asteroidSearch.results.length !== 3) {
        this.isModalOpen = false;
      }
    });
    setInterval(() => { this.updateTimer(); }, 1000);
  }

}
