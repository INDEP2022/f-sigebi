import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportConsolidatedEntryOrderComponent } from './report-consolidated-entry-order/report-consolidated-entry-order.component';
import { ReportExpensesForGoodComponent } from './report-expenses-for-good/report-expenses-for-good.component';

const routes: Routes = [
  {
    path: 'report-expenses-for-good',
    component: ReportExpensesForGoodComponent,
  },
  {
    path: 'report-consolidated-entry-order',
    component: ReportConsolidatedEntryOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultReportRoutingModule {}
