import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) {

  }
  login(uname: any, psw: any) {
    return this.auth.signInWithEmailAndPassword(uname, psw);
  }
  signup( email: any, psw: any) {
    return this.auth.createUserWithEmailAndPassword(email, psw);
  }

  isUserLoggedIn() {
    return this.auth.user;
  }

  logout() {
    return this.auth.signOut();
  }


}
