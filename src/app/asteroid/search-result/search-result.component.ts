import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { Asteroid } from '../asteroid';
import { SocketService } from '../../socket/socket.service';

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
