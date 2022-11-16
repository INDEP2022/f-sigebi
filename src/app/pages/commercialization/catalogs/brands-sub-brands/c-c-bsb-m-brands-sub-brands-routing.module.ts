import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCBsblCBrandsSubBrandsListComponent } from './brands-sub-brands-list/c-c-bsbl-c-brands-sub-brands-list.component';

const routes: Routes = [
  {
    path: '',
    component: CCBsblCBrandsSubBrandsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCBsbMBrandsSubBrandsRoutingModule {}
