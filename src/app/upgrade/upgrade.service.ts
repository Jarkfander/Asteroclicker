import { Injectable } from '@angular/core';
import { Storage } from './storage';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class UpgradeService {

  db: AngularFireDatabase;
 // storage: Storage[];
  afAuth: AngularFireAuth;

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {
    /*
    this.db = db;
    this.afAuth = afAuth;
    //afAuth.auth.signInWithEmailAndPassword("test@test.fr","aaaaaa");
    afAuth.authState.subscribe((auth) => {
      if (auth != null) {
        this.db.object.apply('storage').once().subscribe(
          (snapshot: any) => {
            console.log(snapshot.val());
            this.FillStock(snapshot.val());
          });

      }
    });*/
  }
  
  FillStock(snapshot) {
    // let temp = new Storage();
/*
    for( let i = 0 ; i < ) {
        this.storage.push(temp);
    }
    */
  }

}

