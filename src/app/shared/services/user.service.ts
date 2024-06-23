import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor() {}

  async create(user: User): Promise<void> {
    try {
      await setDoc(doc(this.db, 'users', user.id), user);
    } catch (error) {
      console.error('Hiba a user dokumentum készítése közben:', error);
      throw error;
    }
  }

  async getById(id:string): Promise<User | undefined>{
    const docRef = doc(this.db,"users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      return undefined;
    }
    
  }

  getByIdObservable(id: string) {
    return from(this.getById(id)).pipe(
      map(user => {
        if (user) {
          return user;
        } else {
          throw new Error('User not found');
        }
      })
    );
  }

  getAll(){

  }

  update(){

  }

  delete(){

  }
}
