import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatTransferentComponent } from './cat-transferent/cat-transferent.component';

const routes: Routes = [
  {
    path: '',
    component: CatTransferentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatTransferentRoutingModule {}
