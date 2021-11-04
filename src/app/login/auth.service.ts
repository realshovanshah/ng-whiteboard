import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { User } from './auth.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as auth from 'firebase/auth';
import {switchMap, take} from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<User|undefined>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    console.log('AuthService constructor called');
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log(user.uid)
        this.afs.collection('users').doc(`${user.uid}`).get().subscribe(doc => {
          console.log(doc.data())
        })
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else{
          return of(undefined);
        }
      })
    );
  }

  async getUserId(): Promise<string | undefined> {
    console.log('AuthService: getUserId called');
    return (await this.user$.toPromise())?.uid;
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user: firebase.default.User|null) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user?.uid}`);
    
    if(user != null){
      return userRef.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }, { merge: true }
      );
    }else{
      return null;
    }
  }

}