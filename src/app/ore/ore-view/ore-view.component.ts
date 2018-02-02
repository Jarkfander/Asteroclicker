import { Component, AfterViewInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { OreService, IOreInfo } from '../ore.service';
import { Observable } from 'rxjs/Observable';
import { UserService, IUserUpgrade } from '../../shared/user/user.service';
import { UpgradeType } from '../../ship/upgrade-class/upgrade';
import { AsteroidService, IAsteroid } from '../../asteroid/asteroid.service';
import { figuesChange } from './../../shared/animations';

import 'rxjs/add/operator/first';
import { ResourcesService } from '../../shared/resources/resources.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ore-view',
  templateUrl: './ore-view.component.html',
  styleUrls: ['./ore-view.component.scss'],
  animations: [figuesChange]
})
export class OreViewComponent {

  @Input('name') name: string;
  @Input('amount') amount: number;
  @Input('capacity') capacity: number;

  constructor() { }

}

// (this.oreCoef * this.rate)