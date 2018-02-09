import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IBoost } from './../boost';

@Component({
  selector: 'boost-list',
  templateUrl: './boost-list.component.html',
  styleUrls: ['./boost-list.component.scss']
})
export class BoostListComponent implements OnInit {

  @Input() boosts: IBoost[];
  @Output() select = new EventEmitter<IBoost>();

  constructor() { }

  public selection(boost: IBoost) {
    this.select.emit(boost);
  }

  ngOnInit() {
  }

}
