import { Injectable } from '@angular/core';
import { DocumentData, Firestore, Query, QueryDocumentSnapshot, addDoc, arrayUnion, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { collection, getFirestore, setDoc } from 'firebase/firestore';
import { AngularFireList } from '@angular/fire/compat/database';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { deleteObject, getStorage, ref } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class UploadService {


  collection:any;
  q: any;
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  storage = getStorage();

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

  async deleteImage(imageId: string, imageRef: string){
    try {
      const imagesRef = collection(this.db, 'images');
      const q = query(imagesRef, where('id', '==', imageId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (document) => {
          const docId = document.id;
          await deleteDoc(doc(this.db, 'images', docId));
          console.log("Sikeresen törölt kép a Collection-ből");
        });
      } else {
        console.log("Nincs ilyen kép");
      }
    } catch (error) {
      console.error('Hiba a kép törlése közben: ', error);
    }

    const desertRef = ref(this.storage, imageRef);
    deleteObject(desertRef).then(() => {
      console.log("Sikeres képeltávolítás a Storage-ból!");
    }).catch((error) => {
      console.log("Hiba: " + error);
    });
  }

  
}
