import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { arrayRemove, arrayUnion, collection, deleteField, doc, getDoc, getDocs, getFirestore, increment, query, updateDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FollowingService {

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  constructor() { }

  async isFollowed(userId: string, userName: string): Promise<boolean>{
    const ref = collection(this.db,"users");
    const q = query(ref, where('username','==',userName));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
     
      const loggedInUserDoc = userDocs.docs[0];
      const loggedInUserData = loggedInUserDoc.data();
      if (loggedInUserData.followedby && Array.isArray(loggedInUserData.followedby)) {
        return loggedInUserData.followedby.includes(userId);
      }
    }
  
    return false;

  }

  async addFavorite(userId: string, userName: string): Promise<void>{
    const userRef = collection(this.db, "users");
    const q = query(userRef, where('username', '==', userName));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);

      const userData = userDoc.data();
      if (userData.followed && userData.followed.includes(userId)) {
        console.log("A kép már hozzá van adva a kedvencekhez");
        return; 
      }
      
      await updateDoc(userDocRef, {
        followedby: arrayUnion(userId),
      });
      await this.updateFollowerCount(userId,userName, 1)
    } else {
      console.error("Felhasználó nem található");
    }

    const otherUserRef = collection(this.db, "users");
    const ouq = query(otherUserRef, where('id', '==', userId));
    const otherUserDoc = await getDocs(ouq);
    if (!otherUserDoc.empty) {
      const otherUserDocs = otherUserDoc.docs[0];
      const otherUserDocRef = doc(this.db, "users", otherUserDocs.id);

      await updateDoc(otherUserDocRef, {
        following: arrayUnion(userName),
      });
    } else {
      console.error("Felhasználó nem található");
    }

  }

  async updateFollowerCount(userId: string, userName: string, count: number): Promise<void> {
    const userRef = collection(this.db, "users");
    const q = query(userRef, where('username', '==', userName));
    const userDoc = await getDocs(q);
    if (!userDoc.empty) {
      const userDocs = userDoc.docs[0];
      const userDocRef = doc(this.db, "users", userDocs.id);

      await updateDoc(userDocRef, {
        followerCount: increment(count)
      });
    } else {
      console.error("Felhasználó nem található");
    }

    const otherUserRef = collection(this.db, "users");
    const ouq = query(otherUserRef, where('id', '==', userId));
    const otherUserDoc = await getDocs(ouq);
    if (!otherUserDoc.empty) {
      const otherUserDocs = otherUserDoc.docs[0];
      const otherUserDocRef = doc(this.db, "users", otherUserDocs.id);

      await updateDoc(otherUserDocRef, {
        followingCount: increment(count)
      });
    } else {
      console.error("Felhasználó nem található");
    }
  }

  async getFollowerCount(userId: string): Promise<number> {
    const userRef = collection(this.db, "users");
    const q = query(userRef, where('id', '==', userId));
    const userDoc = await getDocs(q);
    if (!userDoc.empty) {
      const userDocs = userDoc.docs[0];
      const userData = userDocs.data();
      console.log(userData); 
      return userData.followerCount || 0;
    } else {
      console.error("Felhasználó nem található");
      return 0;
    }
  }

  async getFollowingCount(userId: string): Promise<number> {
    const userRef = collection(this.db, "users");
    const q = query(userRef, where('id', '==', userId));
    const userDoc = await getDocs(q);
    if (!userDoc.empty) {
      const userDocs = userDoc.docs[0];
      const userData = userDocs.data();
      console.log(userData); 
      return userData.followingCount || 0;
    } else {
      console.error("Felhasználó nem található");
      return 0;
    }
  }

  async unFollow(userId: string, userName: string, otheruserId: string): Promise<void>{
    const otherUserRef = collection(this.db, "users");
    const ouq = query(otherUserRef, where('id', '==', otheruserId));
    const otherUserDoc = await getDocs(ouq);
    if (!otherUserDoc.empty) {
      const otherUserDocs = otherUserDoc.docs[0];
      const otherUserDocRef = doc(this.db, "users", otherUserDocs.id);

      try
      {await updateDoc(otherUserDocRef, {
        followedby: arrayRemove(userId),
      });
      console.log("siker")
    }catch{
      console.error("Nem működöm followedby" + userId);
    }
      await this.updateFollowerCount(userId,userName, -1);
    } else {
      console.error("Felhasználó nem található");
    }

    const userRef = collection(this.db, "users");
    const q = query(userRef, where('id', '==', userId));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);

      try{
      await updateDoc(userDocRef, {
        following: arrayRemove(userName),
      });
      console.log("siker")
    }catch{
      console.error("Nem tudlak törölni following" + userName);
    }
    } else {
      console.error("Felhasználó nem található");
    }

  }

  async deleteFollower(userId: string, userName: string, otherid: string){
    const otherUserRef = collection(this.db, "users");
    const ouq = query(otherUserRef, where('id', '==', userId));
    const otherUserDoc = await getDocs(ouq);
    if (!otherUserDoc.empty) {
      const otherUserDocs = otherUserDoc.docs[0];
      const otherUserDocRef = doc(this.db, "users", otherUserDocs.id);

      try{
      await updateDoc(otherUserDocRef, {
        following: arrayRemove(userName),
      });
    }catch{
      console.error("Nem tudlak törölni following" + userName);
    }
      await this.updateFollowerCount(userId,userName, -1);
    } else {
      console.error("Felhasználó nem található");
    }

    const userRef = collection(this.db, "users");
    const q = query(userRef, where('username', '==', userName));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      const userDocRef = doc(this.db, "users", userDoc.id);

      try{
      await updateDoc(userDocRef, {
        followedby: arrayRemove(userId),
      });
      }catch{
        console.error("Nem tudlak törölni followedby" + userId);
      }
    } else {
      console.error("Felhasználó nem található");
    }
  }

}
