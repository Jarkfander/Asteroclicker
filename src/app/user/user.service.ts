import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { Storage } from '../upgrade/storage';
import { MineRate } from '../upgrade/mineRate';

@Injectable()
export class UserService {

  db : AngularFireDatabase;
  currentUser : User;
  afAuth : AngularFireAuth;

  userSubject = new Subject<User>();

  constructor(db: AngularFireDatabase,afAuth: AngularFireAuth) { 
    this.db=db;
    this.afAuth=afAuth;
    afAuth.authState.subscribe((auth) => {
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

  public LogOut(){
    this.currentUser=null;
    this.afAuth.auth.signOut();
  }

  FillUser(snapshot){
    this.currentUser.carbon=snapshot.carbon;
    this.currentUser.credit=snapshot.credit;
    this.currentUser.email=snapshot.email;

    const tempMine = snapshot.mineRate;
    this.currentUser.mineRate = new MineRate(tempMine.lvl, tempMine.stock, tempMine.mineRate, tempMine.maxRate);

    const tempStock = snapshot.storage;
    this.currentUser.storage = new Storage(tempStock.lvl, tempStock.stock, tempStock.capacity);

    this.userSubject.next(this.currentUser);
  }

}
