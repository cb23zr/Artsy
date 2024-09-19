import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { Observable, from, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor(private http: HttpClient) {}

  async create(user: User): Promise<void> {
    try {
      await setDoc(doc(this.db, 'users', user.id), user);
    } catch (error) {
      console.error('Hiba a user dokumentum készítése közben:', error);
      throw error;
    }
  }

  async getByUsername(username: string) {
    const userRef = collection(this.db, 'users');
    const q = query(userRef, where('username', '==', username));
    
    return from(getDocs(q).then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as User;
    }).catch(error => {
      console.error('Error getting documents: ', error);
      return null;
    }));
    

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
