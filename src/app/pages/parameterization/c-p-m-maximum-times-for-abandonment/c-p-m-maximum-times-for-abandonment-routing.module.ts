import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMtaCMaximumTimesForAbandonmentComponent } from './c-p-mta-c-maximum-times-for-abandonment/c-p-mta-c-maximum-times-for-abandonment.component';

const routes: Routes = [
  {
    path: '',
    component: CPMtaCMaximumTimesForAbandonmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMMaximumTimesForAbandonmentRoutingModule {}
