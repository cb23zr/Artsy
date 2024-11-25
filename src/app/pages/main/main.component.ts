import {Component, OnInit, PipeTransform} from '@angular/core';
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
import { Timestamp } from '@angular/fire/firestore';
import { OrderFormatPipe } from 'src/app/shared/pipes/order-format.pipe';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  
  unsub: any;
  term:any;
  animal: string | undefined;
  defaultorder: any = "default";
  following: boolean = false;
  
  followingList!: any[];
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



  constructor(private fb: FormBuilder, private router: Router, private service: UploadService, public dialog: MatDialog,
              private userService: UserService
  ) {
  }

  async ngOnInit(){

    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    this.userService.getByIdObservable(user.uid).subscribe(data =>{
      if(data){
        this.followingList = data.following;
      }
    })


    try {
      const documents = await this.service.getDocuments();
      this.imageList = [];
      documents.forEach((doc)=>{
        const url= doc.get("imageurl"); 
        const id = doc.get('id');
        const name = doc.get('username');
        const dateTime = doc.get('date');
        const date = dateTime.toDate();
        const caption = doc.get('caption');
        const favCount = doc.get('favCount');

        if(url){
          for(const user of this.followingList){
            if(user === name){
              this.following = true;
            }else{
              this.following = false;
            }
          }
          const onTheList = this.following;
          this.imageList.push({id,url,name, date, caption, favCount, onTheList});
        }
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

  openDialog(id: string, imageurl:string, name: string, date: Timestamp, caption: string): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user && name !== undefined) {
      
      const dialogRef = this.dialog.open(PopupComponent, {
      data: {id: id ,name: name, imageUrl: imageurl, date:date, caption: caption},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('A dialog be lett zárva', result);
      this.reloadData();
    });
    }else{
      const dialogRef = this.dialog.open(LoginPopupComponent,{})
    }
  }

  reloadData(): void {
    this.service.getDocuments().then((documents) => {
      this.imageList = [];
      documents.forEach((doc) => {
        const url = doc.get("imageurl");
        const id = doc.get('id');
        const name = doc.get('username');
        const dateTime = doc.get('date');
        const date = dateTime.toDate();
        const caption = doc.get('caption');
        const favCount = doc.get('favCount');

        if (url) {
          for(const user of this.followingList){
            if(user === name){
              this.following = true;
            }else{
              this.following = false;
            }
          }
          const onTheList = this.following;
          this.imageList.push({ id, url, name, date, caption, favCount, onTheList});
        }
      });
    }).catch(error => {
      console.error('Hiba újratöltés közben:', error);
    });
  }

 
}
