import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanMonitorComponent } from './loan-monitor/loan-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: LoanMonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanMonitorRoutingModule {}
