import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-market-view',
  templateUrl: './market-view.component.html',
  styleUrls: ['./market-view.component.scss']
})
export class MarketViewComponent implements OnInit {

  constructor(private userS : UserService) { }

  ngOnInit() {
  }
  
  public SellCarbon() {
    this.userS.SellCarbon(10);
  }
}
