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
     loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'profile/:username',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
  },
    
  { path: 'not-found',
    loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule)},
  { path:'', redirectTo:'/main', pathMatch:'full'},
  { path: 'error', loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule) },
  { path: 'loginpopup', loadChildren: () => import('./pages/login-popup/login-popup.module').then(m => m.LoginPopupModule) },
  { path: 'upload-image', loadChildren: () => import('./pages/profile/upload-image/upload-image.module').then(m => m.UploadImageModule) },
  { path: 'following', loadChildren: () => import('./pages/profile/following/following.module').then(m => m.FollowingModule) },
  { path: 'follower', loadChildren: () => import('./pages/profile/follower/follower.module').then(m => m.FollowerModule) },
  
  { path:'**', redirectTo:'/not-found',}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
