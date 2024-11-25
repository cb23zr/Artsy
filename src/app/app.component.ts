import {Component, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from "rxjs";
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./shared/services/auth.service";
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { UserService } from './shared/services/user.service';
import { User } from './shared/models/User';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  page = 'main';
  term : any;
  routes: Array<any> = [];
  loggedInUser?: firebase.default.User | null = null;
  user!: User;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
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

}

