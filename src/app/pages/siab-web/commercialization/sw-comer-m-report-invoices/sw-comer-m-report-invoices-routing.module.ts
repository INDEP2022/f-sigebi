import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCReportInvoicesComponent } from './sw-comer-c-report-invoices/sw-comer-c-report-invoices.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCReportInvoicesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMReportInvoicesRoutingModule {}
