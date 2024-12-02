import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from "rxjs";
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./shared/services/auth.service";
import { UserService } from './shared/services/user.service';
import { User } from './shared/models/User';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  page = 'main';
  term : any;
  langSelect: string = "hu";
  routes: Array<any> = [];
  loggedInUser?: firebase.default.User | null = null;
  user!: User;

  constructor(private router: Router, private authService: AuthService, private userService: UserService,
    private translateService: TranslateService
  ) {
    this.translateService.addLangs(['en', 'hu']);
    this.translateService.setDefaultLang('hu');          
    const lang = this.translateService.getBrowserLang();
    if(lang !== undefined){
      this.translateService.use(lang.match(/en|hu|/) ? lang : 'hu');
    }
    
  }

  ngOnInit() {

    this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.loggedInUser = user;
        
      } else {
        this.loggedInUser = null;
        console.log('No user is logged in');
      }
    });

    this.routes = this.router.config.map(conf => conf.path) as string[];
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((events: any) => {
      const currentPage =(events.urlAfterRedirects as string).split('/')[1] as string;
      if(this.routes.includes(currentPage)){
        this.page = currentPage;
      }
    });
    this.authService.isUserLoggedIn().subscribe(user=>{
      this.loggedInUser = user;
      localStorage.setItem('user', JSON.stringify(this.loggedInUser));
    },error =>{
      console.log(error);
      localStorage.setItem('user', JSON.stringify('null'));
    })

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as firebase.default.User;
      if (user && user.uid) { 
        this.userService.getByIdObservable(user.uid).subscribe(async data => {
      
          if (data && data.username) {
            this.user = data;
          }
        }, error => {
          console.error(error);
        });
      }
    }

  }

  oldalValtas(kivalasztottOldal: string){
    this.router.navigateByUrl(kivalasztottOldal) ;
  }
  onToggleSideNav(sidenav: MatSidenav){
    sidenav.toggle()
  }

  onClose(event: boolean, sidenav: MatSidenav) {
    if(event){
      sidenav.close();
    }
  }

  logout(event?: boolean){
    this.authService.logout().then(()=>{
      localStorage.setItem('user', JSON.stringify('null'))
      console.log('Kijelentkeztél!');
      this.router.navigate(['/login']);
    }).catch(error =>{
      console.log(error);
    });
  }

  login(){
    this.authService.isUserLoggedIn().subscribe(user=>{
      this.loggedInUser = user;
      localStorage.setItem('user', JSON.stringify(this.loggedInUser));
    },error =>{
      console.log(error);
      localStorage.setItem('user', JSON.stringify('null'));
    })

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as firebase.default.User;
      if (user && user.uid) { 
        this.userService.getByIdObservable(user.uid).subscribe(async data => {
      
          if (data && data.username) {
            this.user = data;
            this.router.navigate(['/profile/' + this.user.username]);
          }
        }, error => {
          console.error(error);
        });
      }
    }
  }

  switchLanguage() {
    if(this.langSelect === "hu"){
      this.langSelect ="en";
    }else{
      this.langSelect="hu";
    }
    this.translateService.use(this.langSelect);  
    localStorage.setItem('language', this.langSelect);      
  }

}

