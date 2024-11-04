import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowerRoutingModule } from './follower-routing.module';
import { FollowerComponent } from './follower.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material/list';


@NgModule({
  declarations: [
    FollowerComponent
  ],
  imports: [
    CommonModule,
    FollowerRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class FollowerModule { }
