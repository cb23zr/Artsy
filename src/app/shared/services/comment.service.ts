import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { Timestamp, arrayRemove, arrayUnion, collection, deleteDoc, deleteField, doc, getDocs, getFirestore, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/Comment';
import { BehaviorSubject, Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  collectionName = 'Comments';
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();


  constructor() { }

  async create(comment: Comment, userName: string): Promise<void>{
    try {
      await setDoc(doc(this.db, 'comments', comment.id), comment);
      this.refreshComments(comment.imageId);
    } catch (error) {
      console.error('Hiba a komment készítése közben:', error);
      throw error;
    }

    const userRef = collection(this.db, "users");
    const q = query(userRef, where('username', '==', userName));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);
      const userData = userDoc.data();
      await updateDoc(userDocRef, {
        comments: arrayUnion(comment.id),
      });
    }else {
      console.error("Felhasználó nem található");
    }

  }

  getCommentbyId(imageId: string){

    const ref = collection(this.db,"comments");
    const q = query(ref, where('imageId','==',imageId), orderBy('date', 'asc'));
    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const data = doc.data() as Comment;
          if (data.date instanceof Timestamp) {
            data.date = data.date.toDate();
          }
          return data;
          }
      );
      })
    );
  }

  async getCommentsByImageId(imageId: string) {
    const commentsRef = collection(this.db, "comments");
  const q = query(commentsRef, where('imageId', '==', imageId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      uname: data.uname,
      comment: data.comment,
      date: data.date.toDate(),
      imageId: data.imageId
    } as Comment;
  });
  }


  async delete(userId: string, commentId:string): Promise<void>{
    console.log('Komment törlése:', commentId);
    console.log('For user:', userId);
    try{
      await deleteDoc(doc(this.db, "comments", commentId));
      console.log("Komment dokumentum sikeres törlés!")
    }catch{
      console.error("Hiba a komment dokumentum törlése közben")
    }

    try{
      const userRef = collection(this.db, "users");
      const q = query(userRef, where('id', '==', userId));
      const userDocs = await getDocs(q);

      if (!userDocs.empty) {
        const userDoc = userDocs.docs[0];
        const userDocRef = doc(this.db, "users", userDoc.id);
        await updateDoc(userDocRef, {
          comments: arrayRemove(commentId),
        });
        console.log("Sikeres módosítás");
      } else {
        console.error("Felhasználó nem található");
      }
    }catch{
      console.error("Hiba módosítás közben");
    }

  }

  async refreshComments(imageId: string) {
    const comments = await this.getCommentsByImageId(imageId);
    this.commentsSubject.next(comments);
  }

  update(commentId: string, comment: string){
    const commentDoc = doc(this.db, 'comments', commentId);
    return updateDoc(commentDoc, { comment: comment });
  }

}
