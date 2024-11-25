import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FollowingRoutingModule } from './following-routing.module';
import { FollowingComponent } from './following.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    FollowingComponent
  ],
  imports: [
    CommonModule,
    FollowingRoutingModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    Ng2SearchPipeModule,
    
  ]
})
export class FollowingModule { }
