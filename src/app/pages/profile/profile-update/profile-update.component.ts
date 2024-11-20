import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProfileUpdateModule } from './profile-update.module';
import {Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface DialogData {
  id: string;
  intro: string;
  username: string;
}

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent {
  introForm: FormGroup;
  updatefail: string = '';

  constructor(
    public dialogRef: MatDialogRef<ProfileUpdateComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog, private router: Router, private userService: UserService,
    private fb: FormBuilder) {
      this.introForm = this.fb.group({
        intro: [data.intro, [Validators.required, Validators.maxLength(150)]],
      });
    }

   
  updateIntro(){
    if(this.introForm.valid && this.introForm.value.intro){
      console.log(this.introForm.value.intro);
      this.userService.update(this.data.id, this.introForm.value.intro);
      this.onNoClick();
    }else{
      this.updatefail="Hiba a módosítás közben!";
    }
  
  }

  onNoClick(): void {
    this.dialogRef.close();
    const decodedUsername = decodeURIComponent(this.data.username);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile/' + decodedUsername]);
    });
  }

  

}
