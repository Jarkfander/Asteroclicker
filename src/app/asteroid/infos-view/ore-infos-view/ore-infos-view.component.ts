import { Component, OnInit, Input } from '@angular/core';
import { Asteroid } from '../../asteroid';

@Component({
  selector: 'app-ore-infos-view',
  templateUrl: './ore-infos-view.component.html',
  styleUrls: ['./ore-infos-view.component.scss']
})
export class OreInfosViewComponent implements OnInit {

  @Input('name') name: string;
  @Input('amount') amount: number ;
  @Input('rate') rate: number ;
  @Input('capacity') capacity: number;

  constructor() { }

  ngOnInit() {
  }

}
