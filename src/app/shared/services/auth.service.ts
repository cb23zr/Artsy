import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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


}
