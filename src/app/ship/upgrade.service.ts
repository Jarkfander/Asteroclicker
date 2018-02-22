import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import { Storage } from './upgrade-class/storage';
import { MineRate } from './upgrade-class/mineRate';
import { Research } from './upgrade-class/research';
import { Engine } from './upgrade-class/engine';
import { OreService } from '../ore/ore.service';
import { QG } from './upgrade-class/qg';
import { IUserUpgrade } from '../shared/user/user.service';


@Injectable()
export class UpgradeService {

  public activeUserUpgrade$ = new Subject<IUserUpgrade>();

  constructor() {

  }

}
