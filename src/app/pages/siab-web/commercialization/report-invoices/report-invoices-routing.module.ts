import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { reportInvoicesComponent } from './report-invoices/report-invoices.component';

const routes: Routes = [
  {
    path: '',
    component: reportInvoicesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class reportInvoicesRoutingModule {}
