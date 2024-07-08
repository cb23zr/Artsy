import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import {ProfileComponent} from "./profile.component";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from '@angular/material/select';
import { UploadPopupComponent } from './upload-popup/upload-popup.component';


@NgModule({
  declarations: [
    ProfileComponent,
    UploadPopupComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ]
})
export class ProfileModule { }
