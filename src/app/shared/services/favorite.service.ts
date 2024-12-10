import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { arrayRemove, arrayUnion, collection, deleteField, doc, getDoc, getDocs, getFirestore, increment, query, updateDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor() { }

  async isFavorite(imageId: string, userName: string): Promise<boolean>{
    const ref = collection(this.db,"users");
    const q = query(ref, where('username','==',userName));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const docs = userDocs.docs[0];
      const userData = docs.data();
      return userData.favorites && userData.favorites.includes(imageId);
    }
    return false;

  }

  async addFavorite(imageId: string, userName: string): Promise<void>{
    const userRef = collection(this.db, "users");
    const q = query(userRef, where('username', '==', userName));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);

      const userData = userDoc.data();
      if (userData.favorites && userData.favorites.includes(imageId)) {
        console.log("A kép már szerepel a kedvelések között!");
        return; 
      }
      
      await updateDoc(userDocRef, {
        favorites: arrayUnion(imageId),
      });
      await this.updateFavCount(imageId, 1)
    } else {
      console.error("Felhasználó nem található");
    }

    const imagesRef = collection(this.db, "images");
    const iq = query(imagesRef, where('id', '==', imageId));
    const imageDoc = await getDocs(iq);
    if (!imageDoc.empty) {
      const imageDocs = imageDoc.docs[0];
      const imageDocRef = doc(this.db, "images", imageDocs.id);

      await updateDoc(imageDocRef, {
        favUsers: arrayUnion(userName),
      });
    } else {
      console.error("Kép nem található");
    }

  }

  async updateFavCount(imageId: string, count: number): Promise<void> {
    const imagesRef = collection(this.db, "images");
    const q = query(imagesRef, where('id', '==', imageId));
    const imageDoc = await getDocs(q);
    if (!imageDoc.empty) {
      const imageDocs = imageDoc.docs[0];
      const imageDocRef = doc(this.db, "images", imageDocs.id);

      await updateDoc(imageDocRef, {
        favCount: increment(count)
      });
    } else {
      console.error("Kép nem található");
    }
  }

  async getImageFavCount(imageId: string): Promise<number> {
    const imagesRef = collection(this.db, "images");
    const q = query(imagesRef, where('id', '==', imageId));
    const imageDoc = await getDocs(q);
    if (!imageDoc.empty) {
      const imageDocs = imageDoc.docs[0];
      const imageData = imageDocs.data();
      console.log(imageData); 
      return imageData.favCount || 0;
    } else {
      console.error("Kép nem található");
      return 0;
    }
  }

  async deleteFavorit(imageId: string, userName: string): Promise<void>{
    const imagesRef = collection(this.db, "images");
    const iq = query(imagesRef, where('id', '==', imageId));
    const imageDoc = await getDocs(iq);
    if (!imageDoc.empty) {
      const imageDocs = imageDoc.docs[0];
      const imageDocRef = doc(this.db, "images", imageDocs.id);

      await updateDoc(imageDocRef, {
        favUsers: arrayRemove(userName),
      });
      await this.updateFavCount(imageId, -1);
    } else {
      console.error("Kép nem található");
    }

    const userRef = collection(this.db, "users");
    const q = query(userRef, where('username', '==', userName));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);

      await updateDoc(userDocRef, {
        favorites: arrayRemove(imageId),
      });
    } else {
      console.error("Kép nem található");
    }

  }

}
