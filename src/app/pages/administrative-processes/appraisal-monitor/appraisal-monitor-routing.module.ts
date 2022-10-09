import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalMonitorComponent } from './appraisal-monitor/appraisal-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: AppraisalMonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalMonitorRoutingModule {}
