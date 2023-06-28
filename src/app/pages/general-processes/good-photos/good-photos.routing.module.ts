import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodPhotosComponent } from './good-photos.component';
const routes: Routes = [
  {
    path: '',
    component: GoodPhotosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodPhotosRoutingModule {}
