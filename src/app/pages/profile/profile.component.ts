import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage,getStorage,ref } from '@angular/fire/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/User';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/pages/main/popup/popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { FollowingService } from 'src/app/shared/services/following.service';
import { FollowingComponent } from './following/following.component';
import { FollowerComponent } from './follower/follower.component';
import { async, Subscription, switchMap } from 'rxjs';
import { doc, Timestamp } from '@angular/fire/firestore';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  name!: string;
  user!: User;
  imageList!: any[];
  loggedinprofile: Boolean = false;
  isFollowed: boolean = false;
  followingCount:number = 0;
  followerCount: number = 0;
  followedby: string[] = [];
  following: string[] = [];
  ownProfile:boolean = false; 
  routeParamsSub!: Subscription;


constructor(public dialog: MatDialog, private userService: UserService,
    private service: UploadService, private route: ActivatedRoute,
    private router:Router, private authService: AuthService,
    private followService: FollowingService) {}

  async ngOnInit(){

    this.routeParamsSub=this.route.params.subscribe(params => {
      this.name = params['username'];
      this.onNavigate(this.name);

      const loggedin = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  
      this.userService.getByUsername(this.name).subscribe(
        
        async (fetchedUser) => {
          if (fetchedUser) {
            this.user = fetchedUser;
            this.followerCount = this.user.followerCount;
            this.followingCount = this.user.followingCount;            
            
            this.followService.isFollowed(loggedin.uid, this.user.username).then(isFollowing => {
              this.isFollowed = isFollowing;
            });

            this.followerCount = this.user.followerCount;
            this.authService.getAuthState().subscribe(loggedInUser => {
              if (loggedInUser && fetchedUser) {
                this.loggedinprofile = loggedInUser.uid === fetchedUser.id;
              }
            });
      
            try {
              const documents = await this.service.getDocuments();
              this.imageList = [];
      
              documents.forEach((doc) => {
                const url = doc.get("imageurl");
                const id = doc.get('id');
                const uname = doc.get('username');
                const date = doc.get('date');
      
                if (uname === this.user.username) {
                  if (url) {
                    this.imageList.push({ id, url, date});
                  }
                }
              });
            } catch (error) {
              console.error('Hiba: ', error);
              this.router.navigate(['/not-found']);
            }
          } else {
            console.log('Nincs ilyen felhasználónév: ', this.name);
            this.router.navigate(['/not-found']);
            
          }
        },
        error => {
          console.error('Hiba: ', error);
        }
      )

  });

  this.ownProfileCheck();
}

ownProfileCheck(){
  const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  this.userService.getByIdObservable(user.uid).subscribe(async data => {
    if (data && data.username) {
      if(this.name === data.username){
        this.loggedinprofile = true;
        this.ownProfile= true;
      }else{
        this.ownProfile= false;
      }
    }
  }, error => {
    console.error(error);
  });
}



onNavigate(username: string) {
  this.following = []; 
  this.followedby= []; 
  this.ownProfileCheck();
  this.loadData(username);  
}

onChange(uid: string){
  this.following = []; 
  this.followedby= []; 
  this.ownProfileCheck();
  this.loadDataByID(uid);
}


loadData(username: string) {
  this.userService.getByUsername(username).subscribe(fetchedUser => {
    if (fetchedUser && fetchedUser.following) {
      this.following = fetchedUser.following;
    }
    if (fetchedUser && fetchedUser.followedby ) {
      this.followedby = fetchedUser.followedby;
    }
  });
}

loadDataByID(uid:string){
  this.userService.getByUsername(uid).subscribe(fetchedUser => {
    if (fetchedUser && fetchedUser.following) {
      this.following = fetchedUser.following;
    }
    if (fetchedUser && fetchedUser.followedby ) {
      this.followedby = fetchedUser.followedby;
    }
  });
}

openDialog(id: string, imageurl:string, date: Timestamp): void {
  const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  if(user){
    const actualDate =date.toDate();
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {id: id ,name: this.name, imageUrl: imageurl, date: actualDate},
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed', result);
  });
  }
}

openFollowingDialog(){
  const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  if(user){
    console.log(this.ownProfile+ " cica")
    const dialogRef = this.dialog.open(FollowingComponent, {
      data: {following:this.following, username: this.name, uid: user.uid, own:this.ownProfile}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed', result);
  });
  }
}

openFollowerDialog(){
  const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  if(user){
    console.log(this.ownProfile+ " cica")
    const dialogRef = this.dialog.open(FollowerComponent, {
      data: {followedby:this.followedby, username: this.name, uid: user.uid,own: this.ownProfile}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed', result);
  });
  }
}


async follow(){
  const loggedin = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  if (this.user) {
    if (this.isFollowed) {
      await this.followService.unFollow(loggedin.uid, this.user.username);
      this.isFollowed = false;
      this.followerCount--;
      this.onChange(loggedin.uid);
      console.log('User successfully removed from following!');
      
    } else {
      await this.followService.addFavorite(loggedin.uid, this.user.username);
      this.isFollowed = true;
      this.followerCount++;  
      this.onNavigate(this.user.username);
        
      console.log('User successfully added to following!');
    }
  } else {
    console.error('User not logged in');
  }
}

deleteProfile(){
  /*
  *
  * to do
  * 
  */
  this.userService.delete(this.user.id);

}

}


