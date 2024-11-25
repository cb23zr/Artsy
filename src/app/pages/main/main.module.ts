import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import {MainComponent} from "./main.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderFormatPipe } from 'src/app/shared/pipes/order-format.pipe';




@NgModule({
  declarations: [
    MainComponent,
    OrderFormatPipe,
  ],
  imports: [
    MainRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    Ng2SearchPipeModule,
]
})
export class MainModule { }
