import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-ore-view',
  templateUrl: './ore-view.component.html',
  styleUrls: ['./ore-view.component.scss']
})
export class OreViewComponent implements OnInit {

  @Input('name') name: string;
  @Input('amount') amount: number ;
  @Input('rate') rate: number ;
  @Input('capacity') capacity: number;

  constructor() { }

  ngOnInit() {
  }

}
