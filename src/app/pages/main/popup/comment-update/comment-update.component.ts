import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommentService } from 'src/app/shared/services/comment.service';

export interface DialogData {
  id: string;
  comment: string;
}

@Component({
  selector: 'app-comment-update',
  templateUrl: './comment-update.component.html',
  styleUrls: ['./comment-update.component.scss']
})
export class CommentUpdateComponent {

  commentForm: FormGroup;
  updatefail: string = '';

  constructor(
    public dialogRef: MatDialogRef<CommentUpdateComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog, private router: Router, private commentService:CommentService,
    private fb: FormBuilder) {
      this.commentForm = this.fb.group({
        comment: [data.comment, [Validators.required, Validators.maxLength(150)]],
      });
    }

   
  updateComment(){
    if(this.commentForm.valid && this.commentForm.value.comment){
      console.log(this.commentForm.value.comment);
      this.commentService.update(this.data.id, this.commentForm.value.comment);
      this.onNoClick();
    }else{
      this.updatefail="Hiba a módosítás közben!";
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
