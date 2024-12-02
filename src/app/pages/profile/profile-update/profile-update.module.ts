import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUpdateComponent } from './profile-update.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    declarations: [
      ProfileUpdateComponent
    ],
    imports: [
      CommonModule,
      MatDialogModule,
      MatFormFieldModule,
      FormsModule,
      MatInputModule,
      ReactiveFormsModule,
      MatButtonModule,
      TranslateModule,

    ]
  })
  export class ProfileUpdateModule { }
  