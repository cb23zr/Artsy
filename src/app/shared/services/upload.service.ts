import { Injectable } from '@angular/core';
import { DocumentData, Firestore, Query, QueryDocumentSnapshot, addDoc, arrayUnion, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { collection, getFirestore, setDoc } from 'firebase/firestore';
import { AngularFireList } from '@angular/fire/compat/database';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  collection:any;
  q: any;
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  imageDetailList!: AngularFireList<any>;

  constructor() { }

  async getDocuments(){
    this.q = query(collection(this.db,"images"));
    const docs = await getDocs(this.q);
    return docs;
  }

  async insertImageDetails(imageDetails: any){
    await addDoc(collection(this.db,"images"), imageDetails);
  }

  async getCollection(){
    this.collection = query(collection(this.db,"images"));
    return collection;
  }

  async addToUploads(imageId: string, userName: string): Promise<void>{
    const userRef = collection(this.db, "users");
    const q = query(userRef, where('username', '==', userName));
    const userDocs = await getDocs(q);
    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);

      const userData = userDoc.data();
      
      await updateDoc(userDocRef, {
        uploads: arrayUnion(imageId),
      });
    } else {
      console.error("User not found");
    }

  }

  
}
