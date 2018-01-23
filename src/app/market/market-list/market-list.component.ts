import { Component } from '@angular/core';


@Component({
  selector: 'app-market-list',
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.scss']
})
export class MarketViewComponent {

  // TODO : set color elsewhere (BDD ?)
  public ores = [{
    name: 'carbon',
    color: '102,119,4,1'
  }, {
    name: 'iron',
    color: '175,175,175,1'
  }, {
    name: 'titanium',
    color: '105,101,122,1'
  }, {
    name: 'gold',
    color: '255,238,0,1'
  }, {
    name: 'hyperium',
    color: '255,0,234,1'
  }];

  constructor() {}

}
