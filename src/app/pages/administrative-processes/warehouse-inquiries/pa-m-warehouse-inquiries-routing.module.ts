import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaWiCWarehouseInquiriesComponent } from './pa-wi-c-warehouse-inquiries/pa-wi-c-warehouse-inquiries.component';

const routes: Routes = [
  {
    path: '',
    component: PaWiCWarehouseInquiriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMWarehouseInquiriesRoutingModule {}
