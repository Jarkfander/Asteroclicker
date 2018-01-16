import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SocketService } from '../../shared/socket/socket.service';
import { UserService } from '../../shared/user/user.service';
import { IAsteroid } from '../asteroid.service';


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements AfterViewInit {

  constructor(private socketS: SocketService,private userS: UserService) { }

  @Input('asteroid') asteroid:IAsteroid;
  @Input('num') num:number;
  ngAfterViewInit() {
  }

  chooseAsteroid(){
    this.socketS.chooseAsteroid(this.userS.currentUser.uid,this.num);
  }
}
