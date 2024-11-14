import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import {LoginComponent} from "./login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ControlErrorComponent } from "../../shared/error/controlError";
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        LoginRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ControlErrorComponent,
        MatIconModule
    ]
})
export class LoginModule { }
