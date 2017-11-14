import { Component } from '@angular/core';
import { UserService } from './user/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeService } from './upgrade/upgrade.service';
import { MarketService } from './market/market.service';
import { AsteroidService } from './asteroid/asteroid.service';
import { LoadAnimation } from './loadAnimation';
import { QuestService } from './topbar/quest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  loadAnimation: LoadAnimation;

  constructor(private userS: UserService, private upgradeS: UpgradeService,
    private marketS: MarketService, private asteroidS: AsteroidService,
    private questS: QuestService ) {
    this.loadAnimation = new LoadAnimation();
  }

  public ValiderLogIn(log, pswd) {
    this.userS.LogIn(log, pswd);

  }
}
