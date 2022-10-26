import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmFFrPrdfCInvoiceRectificationProcessComponent } from './c-bm-f-fr-prdf-c-invoice-rectification-process/c-bm-f-fr-prdf-c-invoice-rectification-process.component';

const routes: Routes = [
  {
    path: '',
    component: CBmFFrPrdfCInvoiceRectificationProcessComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBmFFrPrdfMInvoiceRectificationProcessRoutingModule { }
