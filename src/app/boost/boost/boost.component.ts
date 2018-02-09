import { Component, OnInit } from '@angular/core';
import { staggerTile } from '../../shared/animations';

@Component({
  selector: 'app-boost',
  templateUrl: './boost.component.html',
  styleUrls: ['./boost.component.scss'],
  animations: [staggerTile]
})
export class BoostComponent implements OnInit {

  public route: 'inventory' | 'store' = 'inventory';

  constructor() { }

  ngOnInit() {
  }

}
