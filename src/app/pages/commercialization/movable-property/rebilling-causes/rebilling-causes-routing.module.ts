import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RebillingCausesComponent } from './rebilling-causes/rebilling-causes.component';

const routes: Routes = [
  {
    path: '',
    component: RebillingCausesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RebillingCausesRoutingModule {}
