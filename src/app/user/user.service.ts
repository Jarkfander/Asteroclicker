import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class UserService {

  db : AngularFireDatabase;
  currentUser : User;
  afAuth : AngularFireAuth;
  constructor(db: AngularFireDatabase,afAuth: AngularFireAuth) { 
    this.db=db;
    this.afAuth=afAuth;
    //afAuth.auth.signInWithEmailAndPassword("test@test.fr","aaaaaa");
    afAuth.authState.subscribe( (auth) => {
      if (auth != null) {
        this.currentUser=new User();
        this.db.object("users/"+auth.uid).snapshotChanges().subscribe(
          (snapshot: any) => {
            this.FillUser(snapshot.payload.val());
        });
      }
    });


  }

  public LogIn(log,pswd){
    this.afAuth.auth.signInWithEmailAndPassword(log,pswd);
  }

  FillUser(snapshot){
    this.currentUser.carbon=snapshot.carbon;
    this.currentUser.credit=snapshot.credit;
    this.currentUser.email=snapshot.email;

    this.currentUser.mineRate.lvl=snapshot.mineRate.lvl;
    this.currentUser.mineRate.cost=snapshot.mineRate.cost;
    this.currentUser.mineRate.maxRate=snapshot.mineRate.maxRate;
    this.currentUser.mineRate.baseRate=snapshot.mineRate.baseRate;

    this.currentUser.storage.lvl=snapshot.storage.lvl;
    this.currentUser.storage.cost=snapshot.storage.cost;
    this.currentUser.storage.capacity=snapshot.storage.capacity;

  }

}
