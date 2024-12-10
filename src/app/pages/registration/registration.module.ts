import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationRoutingModule } from './registration-routing.module';
import {RegistrationComponent} from "./registration.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ControlErrorComponent } from "../../shared/error/controlError";
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";


@NgModule({
    declarations: [
        RegistrationComponent
    ],
    imports: [
        CommonModule,
        RegistrationRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ControlErrorComponent,
        TranslateModule,
        MatIconModule,
        MatCardModule
    ]
})
export class RegistrationModule { }
