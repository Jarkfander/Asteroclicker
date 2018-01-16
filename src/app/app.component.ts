import { Component, Input, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MarketService } from './market/market.service';
import { LoadAnimation } from './loadAnimation';
import { UserService } from './shared/user/user.service';
import { OreInfoService } from './asteroid/ore-info-view/ore-info.service';
import { environment } from '../environments/environment';
import { UpgradeService } from './ship/upgrade.service';
import { QuestService } from './quest/quest.service';
import { RankingService } from './ranking/ranking.service';
import { AuthService } from './signin/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loadingImage = true;

  loadAnimation: LoadAnimation;

  user$: Observable<User>;

  constructor(public authS: AuthService, public upgradeS: UpgradeService,
    public marketS: MarketService,
    public questS: QuestService, public rankingS: RankingService, public oreInfoS: OreInfoService) {
    this.loadAnimation = new LoadAnimation();
  }

  ngOnInit(): void {
    this.user$ = this.authS.User;
  }


  public loadAnimationEnvironment() {
    this.loadingImage = false;
    /*  setTimeout(() => {
        this.loadingImage = false;
    }, environment.loadingTime * 1000);*/
  }

  public ValiderLogIn(log, pswd) {
    this.authS.LogIn(log, pswd);
  }
}

