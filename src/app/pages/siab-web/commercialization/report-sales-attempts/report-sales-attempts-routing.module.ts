import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportSalesAttemptsComponent } from './report-sales-attempts/report-sales-attempts.component';

const routes: Routes = [
  {
    path: '',
    component: ReportSalesAttemptsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportSalesAttemptsRoutingModule {}
