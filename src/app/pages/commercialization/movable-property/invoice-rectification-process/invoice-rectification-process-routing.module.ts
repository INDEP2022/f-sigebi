import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceRectificationProcessComponent } from './invoice-rectification-process/invoice-rectification-process.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceRectificationProcessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceRectificationProcessRoutingModule {}
