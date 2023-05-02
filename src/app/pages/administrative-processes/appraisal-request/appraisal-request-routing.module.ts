import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalRequestComponent } from './appraisal-request.component';

const routes: Routes = [
  {
    path: '',
    component: AppraisalRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalRequestRoutingModule {}
