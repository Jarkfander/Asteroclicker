import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService } from '../../shared/user/user.service';
import { IAsteroid } from '../../asteroid/asteroid.service';


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements AfterViewInit {

  constructor(private socketS: SocketService, private userS: UserService) { }

  @Input('asteroid') asteroid: IAsteroid;
  @Input('num') num: number;
  @Output('choosed') choosed = new EventEmitter<boolean>();

  ngAfterViewInit() { }

  chooseAsteroid() {
    this.socketS.chooseAsteroid(this.num);
    this.choosed.emit(true);
  }
}
