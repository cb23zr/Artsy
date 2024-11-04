import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {AuthService} from "../../shared/services/auth.service";
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  signupForm: FormGroup;

  constructor(private fb: FormBuilder,private location: Location, private authService:AuthService, private router: Router, private userService: UserService) {

    this.signupForm = this.fb.group({
      id:[''],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      psw: ['', [Validators.required, Validators.minLength(6)]],
      repsw: ['', Validators.required],
      lname: ['', Validators.required],
      fname: ['', Validators.required],
      favorites: [''],
      uploads:[''],
      comments:[],
      followerCount: [],
      followingCount:[],
      following:[],
      folloedby: [],
    },
    {
      validator: this.passwordMatchValidator,
    });
  }


  OnSubmit(){
    const emailControl = this.signupForm.get('email');
    const password = this.signupForm.get('psw')?.value;
    const repassword = this.signupForm.get('repsw')?.value;


    if(emailControl?.valid && emailControl != null && password == repassword ){
      const email = emailControl.value;

      this.authService.signup(email, password).then(cred => {
        if(cred){
        console.log("Sikeres regisztráció:",cred);
        const user:User ={
          id: cred.uid as string,
          username: this.signupForm.get('username')?.value,
          email: this.signupForm.get('email')?.value,
          fname: this.signupForm.get('fname')?.value,
          lname: this.signupForm.get('lname')?.value,
          favorites: [],
          uploads: [],
          comments:[],
          followerCount:0,
          followingCount:0,
          following:[],
          followedby:[],

        };
        this.userService.create(user)
      }
        this.router.navigateByUrl('/main');
      }).catch(error => {
        console.error("Hiba:",error);
      });
    } else{
      console.error("Hibás regisztráció!");

    }
  }

  passwordMatchValidator(control: AbstractControl){
    const password = control.get('psw')?.value;
    const confirmPsw = control.get('repsw')?.value;

    return password === confirmPsw ? null : { mismatch: true };
  }

  Back(){
    this.location.back();
  }

}
