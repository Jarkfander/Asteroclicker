import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SocketService } from '../../shared/socket/socket.service';
import { Asteroid } from '../asteroid-view/asteroid';


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements AfterViewInit {

  constructor(private socketS: SocketService) { }

  @Input('asteroid') asteroid:Asteroid;
  @Input('num') num:number;
  ngAfterViewInit() {
  }

  chooseAsteroid(){
    this.socketS.chooseAsteroid(this.num);
  }
}
