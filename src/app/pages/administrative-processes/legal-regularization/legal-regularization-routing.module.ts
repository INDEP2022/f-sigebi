import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalRegularizationComponent } from './legal-regularization/legal-regularization.component';

const routes: Routes = [
  {
    path: '',
    component: LegalRegularizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalRegularizationRoutingModule {}
