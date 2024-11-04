import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private auth: AngularFireAuth) {}


  login(email: any, psw: any) {
    return this.auth.signInWithEmailAndPassword(email, psw)
    .then((userCredential)=>{
      const userCred = userCredential.user;
      return userCred;
    }).catch((error) => {
        console.error("Hiba bejelentkezés közben: ", error);
        throw error;
    
    });

  }

  signup(email: any, psw: any) {
    return this.auth.createUserWithEmailAndPassword(email, psw).then((userCredential)=>{
      const userCred = userCredential.user;
      return userCred;
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
  }

  isUserLoggedIn() {
    return this.auth.user;
  }

  logout() {
    return this.auth.signOut();
  }

  getAuthState(): Observable<firebase.User | null> {
    return this.auth.authState;
  }


}
