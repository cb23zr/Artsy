import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { LoginPopupRoutingModule } from './login-popup-routing.module';
import { LoginPopupComponent } from './login-popup.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    LoginPopupComponent
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    LoginPopupRoutingModule,
    TranslateModule
  ]
})
export class LoginPopupModule { }
