import { Component, OnInit, Input } from '@angular/core';
import { IBoost, IUserBoost } from '../boost';

@Component({
  selector: 'boost-view',
  templateUrl: './boost-view.component.html',
  styleUrls: ['./boost-view.component.scss']
})
export class BoostViewComponent implements OnInit {

  @Input() boost: IUserBoost;

  constructor() { }

  ngOnInit() {

  }

}
