import { BoostService } from './../boost.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { staggerTile } from '../../shared/animations';
import { NexiumService } from '../../web3-m/nexium.service';

@Component({
  selector: 'app-boost',
  templateUrl: './boost.component.html',
  styleUrls: ['./boost.component.scss'],
  animations: [staggerTile]
})
export class BoostComponent implements OnInit {

  public route: 'inventory' | 'store' = 'inventory';
  public nxc$: Observable<number>;

  constructor(private nxcS: NexiumService, private boostS: BoostService) { }

  ngOnInit() {
    this.nxcS.changeNexium();
    this.nxc$ = this.nxcS.nexium$;
  }

}
