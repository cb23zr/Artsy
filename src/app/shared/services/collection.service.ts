import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { arrayUnion, collection, doc, DocumentData, getDoc, getDocs, getFirestore, increment, orderBy, query, setDoc, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Collection } from '../models/Collection';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor() { }

  async create(coll: Collection, userId: string): Promise<void>{
    try {
      await setDoc(doc(this.db, 'collections', coll.id), coll);
      console.log("Sikeres dokumentum létrehozás");
    } catch (error) {
      console.error('Hiba a collection készítése közben:', error);
      throw error;
    }

    const userRef = collection(this.db, "users");
    const q = query(userRef, where('id', '==', userId));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);
      const userData = userDoc.data();
      await updateDoc(userDocRef, {
        collections: arrayUnion(coll.id),
      });
    }else {
      console.error("User not found");
    }
  }

  getCollection(userName: string){

    const ref = collection(this.db,"collections");
    const q = query(ref, where('username','==',userName), orderBy('date', 'asc'));
    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const data = doc.data() as Collection;
          if (data.date instanceof Timestamp) {
            data.date = data.date.toDate();
          }
          return data;
          }
      );
      })
    );
  }

  async saveImg(collId: string, imgId: string){
    const collDocRef = doc(this.db, "collections", collId);
    await updateDoc(collDocRef, {
      images: arrayUnion(imgId),
      imgCount: increment(1)
    });


  }

  async getById(id:string): Promise<Collection | undefined>{
    const docRef = doc(this.db,"collections", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Collection;
    } else {
      return undefined;
    } 
  }

  getCollectionById(id: string) {
    return from(this.getById(id)).pipe(
      map(coll => {
        if (coll) {
          return coll;
        } else {
          throw new Error('Nem található kollekció');
        }
      })
    );
  }

  async getId(title: string){
    const collRef = collection(this.db, "collections");
    const q = query(collRef, where('title', '==', title));
    const collDocs = await getDocs(q);
    if(!collDocs.empty){
      const collDoc = collDocs.docs[0];
      const collData = collDoc.data();
      return collData.id;  
    }else{
      return undefined;
    }

  }

}
