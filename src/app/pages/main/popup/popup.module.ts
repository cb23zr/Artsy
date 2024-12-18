import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupRoutingModule } from './popup-routing.module';
import { PopupComponent } from './popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {DatePipe} from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { CommentUpdateComponent } from './comment-update/comment-update.component';
import { CollectionPopupComponent } from './collection-popup/collection-popup.component'; 
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    PopupComponent,
    CommentUpdateComponent,
    CollectionPopupComponent
  ],
  imports: [
    CdkTableModule,
    MatTableModule,
    MatInputModule,
    CommonModule,
    PopupRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatListModule,
    TranslateModule,
    MatIconModule
  ]
})
export class PopupModule { }
