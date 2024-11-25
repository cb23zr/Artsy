import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowerRoutingModule } from './follower-routing.module';
import { FollowerComponent } from './follower.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatIconModule } from '@angular/material/icon';


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
    MatIconModule,
    Ng2SearchPipeModule,
  ]
})
export class FollowerModule { }
