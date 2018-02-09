import { Component, OnInit, Input } from '@angular/core';
import { IBoost } from '../boost';

@Component({
  selector: 'boost-view',
  templateUrl: './boost-view.component.html',
  styleUrls: ['./boost-view.component.scss']
})
export class BoostViewComponent implements OnInit {

  @Input() boost: IBoost;

  constructor() { }

  ngOnInit() {
  }

}
