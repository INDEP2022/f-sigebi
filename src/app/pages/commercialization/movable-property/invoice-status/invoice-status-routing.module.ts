import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceStatusComponent } from './invoice-status/invoice-status.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceStatusRoutingModule {}
