import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActsRegularizationNonExistenceComponent } from './acts-regularization-non-existence/acts-regularization-non-existence.component';

const routes: Routes = [
  {
    path: '',
    component: ActsRegularizationNonExistenceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActsRegularizationNonExistenceRoutingModule {}
