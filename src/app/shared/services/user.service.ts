import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { addDoc, arrayRemove, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, increment, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { Observable, from, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { getAuth } from '@angular/fire/auth';
import { Router} from '@angular/router';
import { AuthService } from './auth.service';
import { UploadService } from './upload.service';
import { CommentService } from './comment.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor(private http: HttpClient, private router: Router,
     private authService: AuthService, private uploadService: UploadService,
     private commentService: CommentService) {}


  async create(user: User): Promise<void> {
    try {
      const docRef = doc(this.db,"users", user.id);
      const docSnap = await getDoc(docRef);
      
      await setDoc(doc(this.db, 'users', user.id), user);
      
    } catch (error) {
      console.error('Hiba a user dokumentum készítése közben:', error);
      throw error;
    }
  }

  getByUsername(username: string): Observable<User | null> {
    const userRef = collection(this.db, 'users');
    const q = query(userRef, where('username', '==', username));
    
    return from(getDocs(q).then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('Nincs ilyen dokumentum.');
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as User;
    }).catch(error => {
      console.error('Hiba: ', error);
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
          throw new Error('Felhasználó nem található');
        }
      })
    );
  }


  update(userId: string, intro: string){
    const userDoc = doc(this.db, 'users', userId);
    return updateDoc(userDoc, { intro: intro });
  }

  async delete(userId: string){

      const usersRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(usersRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const following = userData.following || [];
        const followedby = userData.followedby || [];
        const uploads = userData.uploads || [];
        const comments = userData.comments || [];

        for (const imageId of uploads) {
          try {
            let url = "";
            const imageRef = collection(this.db, "images");
            const q = query(imageRef, where('id', '==', imageId));
            const imageDoc = await getDocs(q);
            if (!imageDoc.empty) {
              imageDoc.forEach(async (document) => {
                const image = document.data();
                url = image.imageurl;
              });
            }
            this.uploadService.deleteImage(imageId, url, userId)
            
          } catch (error) {
            console.error("Hiba törlés közben: ", error);
          }
        }

        for(const username of following){
            this.getByUsername(username).subscribe(async (fetchedUser) =>{
              if (fetchedUser) {

                const userDoc = doc(this.db,"users", fetchedUser.id);
                await updateDoc(userDoc, {
                  followedby: arrayRemove(userId),
                  followerCount: increment(-1)
                })
              }else{
                console.error("Hiba követő törlés közben");
              }
            })
        }

        for(const userId of followedby){
              const userDoc = doc(this.db,"users", userId);
              if(userDoc){
              await updateDoc(userDoc, {
                following: arrayRemove(userData.username),
                followingCount: increment(-1)
              })
              }else{
                console.error("Hiba követés törlés közben");
              }
        }

        for(const commentid of comments){
          if(userDoc){
            this.commentService.delete(userData.username, commentid);
          }else{
            console.error("Hiba comment törlés közben");
          }
        }

        this.uploadService.deleteFav(userData.username);

      }  

      try{
        await deleteDoc(doc(this.db, 'users', userId));
        console.log("Siker");
      } catch(error) {
        console.log("Hiba: " + error);
      };

      const user = getAuth().currentUser;
      user?.delete().then(() => {
          console.log("Sikeres felhasználó törlés");
          this.authService.logout().then(()=>{
            localStorage.setItem('user', JSON.stringify('null'))
            console.log('Kijelentkeztél!');
            this.router.navigate(['/login']);
          }).catch(error =>{
            console.log(error);
          });
        }).catch((error) => {
         console.log("Hiba a törlésnél: " + error);
      });

  }

}
