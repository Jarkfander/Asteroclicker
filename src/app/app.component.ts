import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MarketService } from './market/market.service';
import { LoadAnimation } from './loadAnimation';
import { QuestService } from './market/topbar/quest.service';
import { RankingService } from './market/topbar/ranking.service';
import { UserService } from './shared/user/user.service';
import { UpgradeService } from './ship/upgrade-list/upgrade.service';
import { OreInfoService } from './asteroid/ore-info-view/ore-info.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  loadAnimation: LoadAnimation;

  constructor(public userS: UserService, public upgradeS: UpgradeService,
    public marketS: MarketService,
    public questS: QuestService, public rankingS: RankingService, public oreInfoS: OreInfoService ) {
    this.loadAnimation = new LoadAnimation();
  }

  public ValiderLogIn(log, pswd) {
    this.userS.LogIn(log, pswd);

  }
}
