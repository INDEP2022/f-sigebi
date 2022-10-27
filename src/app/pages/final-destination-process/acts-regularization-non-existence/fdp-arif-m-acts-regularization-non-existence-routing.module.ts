import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpArifCActsRegularizationNonExistenceComponent } from './acts-regularization-non-existence/fdp-arif-c-acts-regularization-non-existence.component';

const routes: Routes = [
  {
    path: '',
    component: FdpArifCActsRegularizationNonExistenceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpArifMActsRegularizationNonExistenceRoutingModule {}
