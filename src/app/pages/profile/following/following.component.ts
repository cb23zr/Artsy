import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/User';
import { FollowingService } from 'src/app/shared/services/following.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit{
  followingUsers: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<FollowingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { following: string[], username:string, uid:string, own: boolean },
    public dialog: MatDialog,
    private userService: UserService,
    private followService: FollowingService,
    private router: Router
   ) {}

   ngOnInit(){
    this.loadFollowingUsers();
   }

   loadFollowingUsers(): void {
    const followingIds = this.data.following;

    followingIds.forEach(userName => {
      this.userService.getByUsername(userName).subscribe(userData => {
        if (userData) {
          this.followingUsers.push(userData);
        }
      });
    });
  }

  

  async delete(username: string){
    console.log(this.data.uid +" és following: "+ username);
    await this.followService.unFollow(this.data.uid, username);
    this.followingUsers = this.followingUsers.filter(user => user.username !== username);
  }

  onNoClick(): void {
    this.dialogRef.close();
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
    });
    
  }

}
