import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, Validators, FormGroupDirective, FormGroup, FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {LoadService} from "../../shared/services/load.service";
import {AuthService} from "../../shared/services/auth.service";
import {  getAuth, signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/User';
import { getRedirectResult, signInWithRedirect } from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;
  loginfail: string = '';
  showPassword: boolean = true;
  loading:boolean = false;
  provider = new GoogleAuthProvider();

  constructor(private fb: FormBuilder, private router: Router,
   private loadingService: LoadService, private authService: AuthService,
  private userService: UserService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      psw: ['', Validators.required],
    })
  }

  ngOnInit() :void{
    
  }

  async login(){
    this.loading = true;
    this.loginfail='';

    if(this.loginForm.valid ){
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('psw')?.value;
   
      try{
        await this.authService.login(email, password);
        this.router.navigateByUrl('/main');
      }catch(error: any) {
        if(error.code === 'auth/user-not-found'){
            this.loginfail = 'Nincs ilyen felhasználó';
        }else{
          this.loginfail = 'Hiba történt bejelenkezés közben';
        }
      }finally{
        this.loading = false;
       }
      }else{
        this.loginfail = ' Kérjük adja meg az email címét és a jelszavát!';
        this.loading = false;
      }
        
    }

    PswVisibility(){
      this.showPassword = !this.showPassword;
    }

    signInWithGoogle(){
      const auth = getAuth();
      console.log("Google sign-in initiated");
        signInWithPopup(auth, this.provider)
          .then((result) => {
            console.log("Google sign-in initiated res");
                
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if(credential!== null){
                  console.log("Google sign-in cred not null");
                  const token = credential.accessToken;
                }
               
                const user = result.user;
                if (user) {
                  console.log("User"+ user.uid)
                  const addUser: User = {
                    id: user.uid,
                    username: user.displayName || '',
                    email: user.email || '',
                    lname: '',
                    fname: '',
                    favorites: [],
                    uploads: [],
                    comments: [],
                    collections: [],
                    followerCount: 0,
                    followingCount: 0,
                    following: [],
                    followedby: [],
                    intro: ''
                  }
                  const userExists = this.userService.getById(addUser.id);
                  if(userExists == undefined){
                    this.userService.create(addUser).then(() => {
                    this.router.navigate(['/main']);
                  });

                  }else{
                    this.router.navigate(['/main']);
                  }

                }
               
              }).catch((error) => {
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error("Google sign-in failed");
                
              });

    }

      
}
