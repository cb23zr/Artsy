import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Comment} from "../../shared/models/Comment";
import {Router} from "@angular/router";
import { UploadService } from 'src/app/shared/services/upload.service';
import {MatDialog} from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { Timestamp } from '@angular/fire/firestore';
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
  defaultorder: any = "";
  following: boolean = false;
  user! : any;
  loading:boolean = false;
  
  followingList!: any[];
  emptyList: boolean = false;
  imageList!: any[];
  rowIndexArray!: any[];



  constructor(private fb: FormBuilder, private router: Router, private service: UploadService, public dialog: MatDialog,
              private userService: UserService
  ) {
    
  }

  async ngOnInit(){
    this.loading = true;
    this.user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if(this.user){
      this.defaultorder = "default";
      this.userService.getByIdObservable(this.user.uid).subscribe(data =>{
        if(data){
          this.followingList = data.following;
          if(this.followingList.length === 0){
            this.emptyList= true;
          }else{
            this.emptyList = false;
          }
          console.log(this.emptyList);
        }
      })
    }else{
      this.defaultorder="mostLikes";
    }


    try {

      if(this.user){
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
            if(this.followingList){
              for(const user of this.followingList){
                if(user === name){
                  this.following = true;
                }else{
                  this.following = false;
                }
              }
            }
          const onTheList = this.following;
          this.imageList.push({id,url,name, date, caption, favCount, onTheList});
          this.loading = false;
        }
        })
      }else{
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
            const onTheList = this.following;
            console.log(name);
            this.imageList.push({id,url,name, date, caption, favCount, onTheList});
            this.loading = false;
          }
          })
      }
      } catch (error) {
      this.loading = false;
      console.error('Hiba a FireStore dokumentumok lekérése közben:', error);
    }
    
  }

  createForm(model: Comment){
    let formGroup = this.fb.group(model);
    formGroup.get('uname')?.addValidators([Validators.required]);
    formGroup.get('comment')?.addValidators([Validators.required, Validators.minLength(5) ]);
    return formGroup;
  }

  openDialog(id: string, imageurl:string, name: string, date: Timestamp, caption: string, userId: string): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user && name !== undefined) {
      
      const dialogRef = this.dialog.open(PopupComponent, {
      data: {id: id ,name: name, imageUrl: imageurl, date:date, caption: caption, userId: userId},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('A dialog be lett zárva', result);
      this.loadData();
    });
    }else{
      this.dialog.open(LoginPopupComponent,{})
    }
  }

  loadData(): void {
  
    this.user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if(this.user){
      this.defaultorder = "default";
    }else{
      this.defaultorder="mostLikes";
    }
    this.service.getDocuments().then((documents) => {
      
      documents.forEach((doc) => {
        const url = doc.get("imageurl");
        const id = doc.get('id');
        const name = doc.get('username');
        const dateTime = doc.get('date');
        const date = dateTime.toDate();
        const caption = doc.get('caption');
        const favCount = doc.get('favCount');

        if (url) {
      
          if(this.followingList){
            for(const user of this.followingList){
              if(user === name){
                this.following = true;
              }else{
                this.following = false;
              }
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
