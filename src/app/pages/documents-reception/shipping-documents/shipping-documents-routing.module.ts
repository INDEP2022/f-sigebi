import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippingDocumentsComponent } from './shipping-documents.component';

const routes: Routes = [
  {
    path: '',
    component: ShippingDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingDocumentsRoutingModule {}
