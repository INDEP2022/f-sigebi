import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCAppraisalChargeComponent } from './sw-comer-c-appraisal-charge/sw-comer-c-appraisal-charge.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCAppraisalChargeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMAppraisalChargeRoutingModule {}
