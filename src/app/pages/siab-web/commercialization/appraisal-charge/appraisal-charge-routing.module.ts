import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appraisalChargeComponent } from './appraisal-charge/appraisal-charge.component';

const routes: Routes = [
  {
    path: '',
    component: appraisalChargeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class appraisalChargeRoutingModule {}
