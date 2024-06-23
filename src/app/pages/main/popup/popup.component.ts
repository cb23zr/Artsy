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
import { UserService } from 'src/app/shared/services/user.service';

export interface DialogData {
  id: string;
  name: string;
  imageUrl: string;
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
  commentForm = this.createForm({
    id: this.generateId(),
    uname: '',
    comment:'',
    date:new Date(),
    imageId: this.data.id,
  });
  displayedColumns: string[] = ['uname', 'comment', 'date'];


  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog, private commService: CommentService,
    private fb: FormBuilder, private userService: UserService
   ) {}

   ngOnChanges(): void {
    this.commService.getCommentbyId(this.data.id).subscribe(comments =>{
      this.comments = comments;
    });
   }

   ngOnInit(){

    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

    this.userService.getByIdObservable(user.uid).subscribe(data => {
      console.log(data);
      if (data) {
        this.user = data;
        this.commentForm.get('uname')?.setValue(this.user.username);
        }
      },error =>{
        console.error(error);
      });
      
     
        this.commService.getCommentbyId(this.data.id).subscribe(comments =>{
          this.comments = comments;
        });
       
    
   }

  

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(model: Comment){
    let formGroup = this.fb.group(model);
    formGroup.get('uname')?.addValidators([Validators.required]);
    formGroup.get('comment')?.addValidators([Validators.required, Validators.minLength(5) ]);
    return formGroup;
  }

  addComment(){
  
      if (this.commentForm.valid) {
        const commentData: Comment = this.commentForm.value as Comment;
        this.commService.create(commentData).then(() => {
          console.log('Comment successfully created!');
        }).catch(error => {
          console.error('Error creating comment:', error);
        });
      }
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 20);
  }

}
