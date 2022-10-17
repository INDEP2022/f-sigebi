import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmFCdrCRebillingCausesComponent } from './c-bm-f-cdr-c-rebilling-causes/c-bm-f-cdr-c-rebilling-causes.component';

const routes: Routes = [
  {
    path: '',
    component: CBmFCdrCRebillingCausesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBmFCdrMRebillingCausesRoutingModule {}
