import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/User';
import { FollowingService } from 'src/app/shared/services/following.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-follower',
  templateUrl: './follower.component.html',
  styleUrls: ['./follower.component.scss']
})
export class FollowerComponent implements OnInit{
  followerUsers: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<FollowerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { followedby: string[], username:string, uid:string, own: boolean },
    public dialog: MatDialog,
    private userService: UserService,
    private followService: FollowingService,
    private router: Router,
   ) {}

   ngOnInit(){
    this.loadFollowingUsers();
   }

   loadFollowingUsers(): void {
    const followerIds = this.data.followedby;
      
    followerIds.forEach(userId => {
      this.userService.getByIdObservable(userId).subscribe(userData => {
        if (userData) {
          this.followerUsers.push(userData);
        }
      })
    });
  }

  async delete(username: string){
    console.log(this.data.uid +" és followers: "+ username);
    await this.followService.unFollow(this.data.uid, username);
    this.followerUsers = this.followerUsers.filter(user => user.username !== username);
  }


  onNoClick(): void {
    this.dialogRef.close();
    const currentUrl = this.router.url;
    const decodedUsername = decodeURIComponent(this.data.username);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile/' + decodedUsername]);
    });
  }

}
