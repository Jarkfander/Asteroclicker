import { Component } from '@angular/core';
import { UserService } from './user/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeService } from './upgrade/upgrade.service';
import { MarketService } from './market/market.service';
import { LoadAnimation } from './loadAnimation';
import { QuestService } from './topbar/quest.service';
import { RankingService } from './topbar/ranking.service';
import { OreInfoService } from './asteroid/ore-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  loadAnimation: LoadAnimation;

  constructor(private userS: UserService, private upgradeS: UpgradeService,
    private marketS: MarketService,
    private questS: QuestService, private rankingS: RankingService, private oreInfoS: OreInfoService ) {
    this.loadAnimation = new LoadAnimation();
  }

  public ValiderLogIn(log, pswd) {
    this.userS.LogIn(log, pswd);

  }
}
