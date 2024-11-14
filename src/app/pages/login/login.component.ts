import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, Validators, FormGroupDirective, FormGroup, FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {LoadService} from "../../shared/services/load.service";
import {AuthService} from "../../shared/services/auth.service";


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

  constructor(private fb: FormBuilder, private router: Router, private loadingService: LoadService, private authService: AuthService) {
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
      

}
