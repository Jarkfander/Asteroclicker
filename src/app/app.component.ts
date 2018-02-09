import { Web3Service } from './web3-m/web3.service';
import { Component, Input, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MarketService } from './market/market.service';
import { LoadAnimation } from './loadAnimation';
import { UserService } from './shared/user/user.service';
import { environment } from '../environments/environment';
import { UpgradeService } from './ship/upgrade.service';
import { QuestService } from './quest/quest.service';
import { RankingService } from './ranking/ranking.service';
import { AuthService } from './signin/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';

import { staggerTile } from './shared/animations';
import { ResourcesService } from './shared/resources/resources.service';
import { NexiumService } from './web3-m/nexium.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [staggerTile]
})
export class AppComponent implements OnInit {

  public loadAnimation: LoadAnimation;
  public user$: Observable<User>;
  public loadingImage = true;

  constructor(public authS: AuthService,
    public upgradeS: UpgradeService,
    public marketS: MarketService,
    public questS: QuestService,
    public rankingS: RankingService,
    public resourcesS: ResourcesService,
    private web3S: Web3Service,
    public neximu: NexiumService) { }

  ngOnInit() {
    this.user$ = this.authS.User;
    this.loadAnimation = new LoadAnimation();
    this.web3S.setAddress();
    setTimeout(() => {
      this.loadingImage = false;
    }, environment.loadingTime * 1000); // TODO : Change 0 for 1000
  }

  public ValiderLogIn(log, pswd) {
    this.authS.LogIn(log, pswd);
  }
}

