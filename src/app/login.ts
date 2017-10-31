import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: 'login.html'
})
export class AppComponent {

  public itemsRef: AngularFireList<any>;
  public items: Observable<any[]>;
  private db: AngularFireDatabase;

  constructor(db: AngularFireDatabase) {
    this.db=db;
    this.itemsRef = this.db.list('messages');
    this.items = this.db.list('users').valueChanges();
  }

  /**  */
  updateItem(): void {
    this.db.database.ref("users/CXhZcAzrmnSG4b0ossrrL0dmH9u1").once('value').then(
      (snapshot: any) => {
        const click=snapshot.val().click+1;
        this.db.database.ref("users/CXhZcAzrmnSG4b0ossrrL0dmH9u1").update({
          click: click
        });
    }, (err: Error) => console.log(err)); 
  }

}

