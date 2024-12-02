
import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/User';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  user!: User;

  @Input() currentPage: string = '';
  @Input() loggedInUser?: firebase.default.User | null;
  @Output() kivalasztottOldal: EventEmitter<string> = new EventEmitter();
  @Output() onCloseSidenav: EventEmitter<boolean> = new EventEmitter();
  @Output() onLogout: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router, private userService: UserService){

  }

  menuSwitch(){
    this.kivalasztottOldal.emit(this.currentPage);
  }

  close(logout?: boolean){
    this.onCloseSidenav.emit(true);
    if(logout === true){
      this.onLogout.emit(logout);
    }
  }

  navigateToProfile() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as firebase.default.User;
      if (user && user.uid) { 
        this.userService.getByIdObservable(user.uid).subscribe(async data => {
      
          if (data && data.username) {
            this.user = data;
            this.router.navigate(['/profile/' + this.user.username]);
            this.close();
          }
        }, error => {
          console.error(error);
        });
      }
    }
  }

}
