import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MarketService } from './market/market.service';
import { LoadAnimation } from './loadAnimation';
import { QuestService } from './market/topbar/quest.service';
import { RankingService } from './market/topbar/ranking.service';
import { UserService } from './shared/user/user.service';
import { UpgradeService } from './ship/upgrade-list/upgrade.service';
import { OreInfosService } from './asteroid/ore-infos-view/ore-infos.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public loadAnimation: LoadAnimation;

  constructor(private userS: UserService,
              private upgradeS: UpgradeService,
              private marketS: MarketService,
              private questS: QuestService,
              private rankingS: RankingService,
              private oreInfoS: OreInfosService) {
  }

  ngOnInit() {
    this.loadAnimation = new LoadAnimation();
  }

}
