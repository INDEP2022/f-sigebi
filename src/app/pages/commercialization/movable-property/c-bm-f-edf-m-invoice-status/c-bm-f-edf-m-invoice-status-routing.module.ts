import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmFEdfCInvoiceStatusComponent } from './c-bm-f-edf-c-invoice-status/c-bm-f-edf-c-invoice-status.component';

const routes: Routes = [
  {
    path: '',
    component: CBmFEdfCInvoiceStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBmFEdfMInvoiceStatusRoutingModule {}
