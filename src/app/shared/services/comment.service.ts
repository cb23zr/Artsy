import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { Timestamp, collection, doc, getDocs, getFirestore, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/Comment';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  collectionName = 'Comments';
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor() { }

  async create(comment: Comment): Promise<void>{
    try {
      await setDoc(doc(this.db, 'comments', comment.id), comment);
    } catch (error) {
      console.error('Hiba a comment készítése közben:', error);
      throw error;
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

  getAll(){

  }

  update(){

  }

  delete(){

  }


}
