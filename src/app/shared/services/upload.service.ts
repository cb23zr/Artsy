import { Injectable } from '@angular/core';
import { DocumentData, Firestore, Query, QueryDocumentSnapshot, addDoc, doc, getDocs, query } from '@angular/fire/firestore';
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
    //return docs.docs.map(doc => doc.data());
    return docs;
  }

  async insertImageDetails(imageDetails: any){
    await addDoc(collection(this.db,"images"), imageDetails);
  }

  async getCollection(){
    this.collection = query(collection(this.db,"images"));
    return collection;
  }

  
}
