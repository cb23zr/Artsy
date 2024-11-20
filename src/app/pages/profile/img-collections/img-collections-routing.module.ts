import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImgCollectionsComponent } from './img-collections.component';

const routes: Routes = [{ path: '', component: ImgCollectionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImgCollectionsRoutingModule { }
