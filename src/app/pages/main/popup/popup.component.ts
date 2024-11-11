import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Comment } from 'src/app/shared/models/Comment';
import { User } from 'src/app/shared/models/User';
import { CommentService } from 'src/app/shared/services/comment.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Route, Router } from '@angular/router';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Timestamp } from 'firebase/firestore';

export interface DialogData {
  id: string;
  name: string;
  imageUrl: string;
  date: Date;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnChanges {

  imageList!: DialogData;
  user!: User;
  comments: Array<any> = [];
  commentImg: Array<any> = [];
  commentForm = this.createForm({
    id: this.generateId(),
    uname: '',
    comment:'',
    date:new Date(),
    imageId: this.data.id,
  });
  displayedColumns: string[] = ['uname', 'comment', 'date', 'delete'];
  favCount: number = 0;
  isFavorite: boolean = false;
  followers: string[] = [];
;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog, private commService: CommentService,
    private fb: FormBuilder, private userService: UserService,
    private favService: FavoriteService,
    private uploadService: UploadService,
    private router: Router
   ) {}

   ngOnChanges(): void {
    this.commService.getCommentbyId(this.data.id).subscribe(comments =>{
      this.comments = comments;
    });
   }

   ngOnInit(){
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

    if(user){
    this.userService.getByIdObservable(user.uid).subscribe(async data => {
      if (data && data.username) {
        this.user = data;
        this.commentForm.get('uname')?.setValue(this.user.username);
        this.isFavorite = await this.favService.isFavorite(this.data.id, this.user.username);
        }
      },error =>{
        console.error(error);
      });
    }

      this.commService.comments$.subscribe(comments => {
        this.comments = comments.filter(comment => comment.imageId === this.data.id);
      });
    
      this.commService.getCommentbyId(this.data.id).subscribe(comments => {
        this.comments = comments;
      });
    
      this.commService.getCommentsByImageId(this.data.id).then(comments => {
        this.commentImg = comments;
      });

      this.loadImageFavCount();

       
   }

  createForm(model: Comment){
    let formGroup = this.fb.group(model);
    formGroup.get('uname')?.addValidators([Validators.required]);
    formGroup.get('comment')?.addValidators([Validators.required]);
    return formGroup;
  }

  addComment(){
  
      if(this.commentForm.valid) {
        const commentData: Comment = this.commentForm.value as Comment;
        this.commService.create(commentData, this.user.username).then(() => {
          this.commentImg.push(commentData);
          console.log('Comment successfully created!');
          this.commentForm.patchValue({
            comment: '',
            id: this.generateId(),  
            date: new Date()         
        });
        }).catch(error => {
          console.error('Error creating comment:', error);
        });
      }
  }

  async deleteComment(commentId: string){
    await this.commService.delete(this.user.id,commentId);
    this.comments = this.comments.filter(comment => comment.id !== commentId);
    console.log('Comment successfully removed!');
  }

  deletePic(){
   for(const comment of this.comments){
    this.userService.getByUsername(comment.uname).subscribe(data =>{
      if(data){
        const user = data;
        this.commService.delete(user.id,comment.id);
      }
    })
   }

    this.uploadService.deleteImage(this.data.id, this.data.imageUrl, this.user.id);
    this.onNoClick();
  }

  async onAddFavorit() {
    if (this.user) {
      if (this.isFavorite) {
        await this.favService.deleteFavorit(this.data.id, this.user.username);
        this.isFavorite = false;
        this.favCount--;
        console.log('Image successfully removed from favorites!');
        
      } else {
        await this.favService.addFavorite(this.data.id, this.user.username);
        this.isFavorite = true;
        this.favCount++;
        console.log('Image successfully added to favorites!');
      }
    } else {
      console.error('User not logged in');
    }
  }

  async loadImageFavCount() {
    try {
      const favCount = await this.favService.getImageFavCount(this.data.id);
      this.favCount = favCount;
    } catch (error) {
      console.error('Error loading image fav count:', error);
    }
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 20);
  }

  onNoClick(): void {
    this.dialogRef.close();
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  


}
