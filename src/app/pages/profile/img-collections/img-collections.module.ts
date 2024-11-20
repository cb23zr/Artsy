import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImgCollectionsRoutingModule } from './img-collections-routing.module';
import { ImgCollectionsComponent } from './img-collections.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    ImgCollectionsComponent
  ],
  imports: [
    CommonModule,
    ImgCollectionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    CdkTableModule,
    MatOptionModule,
    MatCardModule,
  ]
})
export class ImgCollectionsModule { }
