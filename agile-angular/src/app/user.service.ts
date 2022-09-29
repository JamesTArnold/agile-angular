import { Injectable, Optional } from '@angular/core';
import { Auth, authState, signInAnonymously, signOut, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userDisposable: Subscription|undefined;
  public readonly user: Observable<User | null> = EMPTY;
  isUserLoggedIn:boolean = false;

  userDetails: User | null = null;

  constructor(@Optional() private auth: Auth) {
    if (auth) {
      this.user = authState(this.auth);
      // this.user.subscribe(user => {
      //   this.userDetails = user;
      //   console.log("🚀 ~ file: user.service.ts ~ line 22 ~ UserService ~ constructor ~ userDetails", this.userDetails)
      // }
      // );

      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {

        this.isUserLoggedIn = !isLoggedIn;
        this.isUserLoggedIn = isLoggedIn;
      });
    }
   }

  getUser(): Observable<User | null> {
    return this.user
  }



}
