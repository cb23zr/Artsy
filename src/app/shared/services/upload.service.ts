import { Injectable } from '@angular/core';
import { DocumentData, Firestore, Query, QueryDocumentSnapshot, addDoc, arrayUnion, deleteDoc, deleteField, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { arrayRemove, collection, getDoc, getFirestore, increment, setDoc } from 'firebase/firestore';
import { AngularFireList } from '@angular/fire/compat/database';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { deleteObject, getStorage, ref } from '@angular/fire/storage';
import { CommentService } from './comment.service';
import { Image } from '../models/Image';
import { from, map } from 'rxjs';


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

  constructor(private commentService : CommentService) { }

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

  async getImageUrl(imageId: string){
      const url = "";
      const imageRef = collection(this.db, "images");
      const q = query(imageRef, where('id', '==', imageId));
      const imageDoc = await getDocs(q);
      if (!imageDoc.empty) {
        imageDoc.forEach(async (document) => {
          const image = document.data();
          const url = image.imageurl;
          return url;
        });
      }else{
        return url;
      }
      return url;
  }

  async getById(id:string): Promise<Image | undefined>{
    const docRef = doc(this.db,"images", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Image;
    } else {
      return undefined;
    } 
  }

  getImageById(id: string) {
    return from(this.getById(id)).pipe(
      map(img => {
        if (img) {
          return img;
        } else {
          throw new Error('Nem található ilyen kép');
        }
      })
    );
  }

  async getImgDoc(id: string){
    const imgRef = collection(this.db, "images");
    const q = query(imgRef, where('id', '==', id));
    const imgDocs = await getDocs(q);
    if(!imgDocs.empty){
      const imgDoc = imgDocs.docs[0];
      const imgData = imgDoc.data();
      return imgData;  
    }else{
      return undefined;
    }
  }

  async addToUploads(imageId: string, userName: string): Promise<void>{
    const userRef = collection(this.db, "users");
    const q = query(userRef, where('username', '==', userName));
    const userDocs = await getDocs(q);
    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);
      
      await updateDoc(userDocRef, {
        uploads: arrayUnion(imageId),
      });
    } else {
      console.error("User not found");
    }

  }

  async deleteImage(imageId: string, imageRef: string, userId: string){

    try {
      const userDoc = doc(this.db,"users", userId);

      await updateDoc(userDoc, {
        uploads: arrayRemove(imageId)
      });

      console.log('Sikeres kép eltávolítás');
    } catch (error) {
      console.error('Hiba a kép törlése közben: ', error);
    }

    const userRef = collection(this.db, 'users');
    const q = query(userRef, where('favorites', 'array-contains', imageId));
    const userDocs = await getDocs(q);
    if (!userDocs.empty) {
      userDocs.forEach(async (userDoc) => {
        const userRef = doc(this.db, 'users', userDoc.id);
        await updateDoc(userRef, {
          favorites: arrayRemove(imageId),
        });
        console.log('Felhasználó kitörölve a kedvelések közül');
      });
    } else {
      console.log('Nincs ilyen felhasználó a kedvelések között');
    }


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

  async deleteFav(userName: string){
    const imagesRef = collection(this.db, 'images');
    const q = query(imagesRef, where('favUsers', 'array-contains', userName));
    const imageDocs = await getDocs(q);
  
    if (!imageDocs.empty) {
      imageDocs.forEach(async (imageDoc) => {
        const imageRef = doc(this.db, 'images', imageDoc.id);
        await updateDoc(imageRef, {
          favUsers: arrayRemove(userName),
          favCount: increment(-1)
        });
        console.log('Felhasználó kitörölve a kedvelések közül');
      });
    } else {
      console.log('Nincs ilyen felhasználó a kedvelések között');
    }

  }

  
}
