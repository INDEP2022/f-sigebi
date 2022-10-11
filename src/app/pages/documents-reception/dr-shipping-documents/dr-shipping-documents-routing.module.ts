import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrShippingDocumentsComponent } from './dr-shipping-documents.component';

const routes: Routes = [
  {
    path: '',
    component: DrShippingDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrShippingDocumentsRoutingModule {}
