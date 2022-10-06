import { Injectable, Optional } from '@angular/core';
import {
  Auth,
  authState,
  User,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userDisposable: Subscription | undefined;
  public readonly user$: Observable<User | null> = EMPTY;
  isUserLoggedIn: boolean = false;

  userDetails: User | null = null;

  constructor(
    @Optional() private auth: Auth,
    public angularFireAuth: AngularFireAuth
  ) {
    if (auth) {
      this.user$ = authState(this.auth);
      // this.user.subscribe(user => {
      //   this.userDetails = user;
      //   console.log("🚀 ~ file: user.service.ts ~ line 22 ~ UserService ~ constructor ~ userDetails", this.userDetails)
      // }
      // );

      this.userDisposable = authState(this.auth)
        .pipe(
          traceUntilFirst('auth'),
          map((u) => !!u)
        )
        .subscribe((isLoggedIn) => {
          this.isUserLoggedIn = !isLoggedIn;
          this.isUserLoggedIn = isLoggedIn;
        });
    }
  }

  getUser(): Observable<User | null> {
    return this.user$;
  }

  loginWithGoogle() {
    this.angularFireAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;


          console.error("loginWithGoogle error:", error);

      });
  }

  loginAnonymously() {
    firebase
      .auth()
      .signInAnonymously()
      .catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode === 'auth/operation-not-allowed') {
          alert('You must enable Anonymous auth in the Firebase Console.');
        } else {
          console.error(error);
        }
      });
  }

  logout() {
    this.auth.signOut();
  }
}
