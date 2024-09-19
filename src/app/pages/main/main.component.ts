import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Comment} from "../../shared/models/Comment";
import {Router} from "@angular/router";
import { UploadService } from 'src/app/shared/services/upload.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { LoginPopupComponent } from '../login-popup/login-popup.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  [x: string]: any;
  unsub: any;

  animal: string | undefined;
  name!: string;

  imageList!: any[];
  rowIndexArray!: any[];

  comments: Array<any> = [];
  commentForm = this.createForm({
    uname: '',
    comment: '',
    date: new Date(),
    imageId: '',
    id: ''
  });



  constructor(private fb: FormBuilder, private router: Router, private service: UploadService, public dialog: MatDialog) {
  }

  async ngOnInit(){

    try {
      const documents = await this.service.getDocuments();
      this.imageList = [];
      documents.forEach((doc)=>{
        const url= doc.get("imageurl"); 
        const id = doc.get('id');
        const name = doc.get('username');
        if(url){
          this.imageList.push({id,url,name});
        }
        console.log({id,url,name});
      })
      } catch (error) {
      console.error('Hiba a FireStore dokumentumok lekérése közben:', error);
    }
    

  }

  createForm(model: Comment){
    let formGroup = this.fb.group(model);
    formGroup.get('uname')?.addValidators([Validators.required]);
    formGroup.get('comment')?.addValidators([Validators.required, Validators.minLength(5) ]);
    return formGroup;
  }

  openDialog(id: string, imageurl:string, name: string): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if(user){
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {id: id ,name: name, imageUrl: imageurl},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
    }else{
      const dialogRef = this.dialog.open(LoginPopupComponent,{
        
      })
    }
  }

  addComment(){
    if(this.commentForm.valid) {
      if (this.commentForm.get('uname') && this.commentForm.get('comment')) {
        this.commentForm.get('date')?.setValue(new Date);
        this.comments.push({...this.commentForm.value});
      }
    }
  }
}
