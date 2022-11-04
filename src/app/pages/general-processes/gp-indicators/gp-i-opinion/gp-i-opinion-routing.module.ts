import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpIOpinionComponent } from './gp-i-opinion/gp-i-opinion.component';

const routes: Routes = [
  {
    path: '',
    component: GpIOpinionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIOpinionRoutingModule {}
