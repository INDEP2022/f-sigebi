import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaLrCLegalRegularizationComponent } from './pa-lr-c-legal-regularization/pa-lr-c-legal-regularization.component';

const routes: Routes = [
  {
    path: '',
    component: PaLrCLegalRegularizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMLegalRegularizationRoutingModule {}
