import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  signupForm = new FormGroup({
    uname: new FormControl(''),
    psw: new FormControl(''),
    repsw: new FormControl(''),
    username: new FormControl(''),
    name: new FormGroup({
      fname: new FormControl(''),
      lname: new FormControl(''),
    }),
  });

  constructor(private location: Location, private authService:AuthService) {
  }

  OnSubmit(){
    this.authService.signup(this.signupForm.get('uname')?.value, this.signupForm.get('psw')?.value).then(cred => {
      console.log(cred);
    }).catch(error => {
      console.error(error);
    });
  }

  Back(){
    this.location.back();
  }

}
