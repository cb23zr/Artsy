import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<LoginPopupComponent>, private router: Router) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onLogin(): void {
    this.dialogRef.close(); 
    this.router.navigate(['/login']);  
  }

}
