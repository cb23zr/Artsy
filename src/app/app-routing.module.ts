import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  { path: 'main',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule)},
  { path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)},
  { path: 'registration',
    loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationModule)},
  { path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
    canActivate:[AuthGuard]
  },
    
  { path: 'not-found',
    loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule)},
  { path:'', redirectTo:'/main', pathMatch:'full'},
  { path: 'error', loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule) },
  { path: 'loginpopup', loadChildren: () => import('./pages/login-popup/login-popup.module').then(m => m.LoginPopupModule) },
  { path:'**', redirectTo:'/not-found',}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
