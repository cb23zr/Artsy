import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage,getStorage,ref } from '@angular/fire/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/User';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/pages/main/popup/popup.component';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  name!: string;
  user!: User;
  imageList!: any[];

  formTemplate = new FormGroup({
    id: new FormControl(""),
    caption: new FormControl("", Validators.required),
    category: new FormControl(""),
    imageUrl: new FormControl("",Validators.required),
    username: new FormControl(""),
    favCount: new FormControl("0"),
    favUsers: new FormControl(''),
})


constructor(public dialog: MatDialog, private userService: UserService,private service: UploadService, private route: ActivatedRoute,) {}

  async ngOnInit(){

    this.route.params.subscribe(params => {
      this.name = params['username'];
    });
  
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

      this.userService.getByIdObservable(user.uid).subscribe(data => {
        if (data) {
          this.user = data;
          this.formTemplate.get('username')?.setValue(this.user.username);
          console.log(this.user.username);
        }
      }, error => {
        console.error(error);
      });
  
    try {
      const documents = await this.service.getDocuments();
      this.imageList = [];
      documents.forEach((doc) => {
        const url = doc.get("imageurl");
        const id = doc.get('id');
        const uname = doc.get('username');
        if (uname == this.user.username) {
          if (url) {
            this.imageList.push({ id, url });
            console.log({ id, url });
          }
        }
      });
    } catch (error) {
      console.error('Hiba a FireStore dokumentumok lekérése közben:', error);
    }
}

openDialog(id: string, imageurl:string): void {
  const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
  if(user){
  const dialogRef = this.dialog.open(PopupComponent, {
    data: {id: id ,name: this.name, imageUrl: imageurl},
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed', result);
  });
  }
}

}


