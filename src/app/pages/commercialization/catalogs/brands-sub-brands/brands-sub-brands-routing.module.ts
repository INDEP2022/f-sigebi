import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { BrandsSubBrandsListComponent } from './brands-sub-brands-list/brands-sub-brands-list.component';

const routes: Routes = [
  {
    path: '',
    component: BrandsSubBrandsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandsSubBrandsRoutingModule {}
