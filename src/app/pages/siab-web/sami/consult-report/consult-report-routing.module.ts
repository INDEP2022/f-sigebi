import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportExpensesForGoodComponent } from './report-expenses-for-good/report-expenses-for-good.component';

const routes: Routes = [
  {
    path: 'report-expenses-for-good',
    component: ReportExpensesForGoodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultReportRoutingModule {}
