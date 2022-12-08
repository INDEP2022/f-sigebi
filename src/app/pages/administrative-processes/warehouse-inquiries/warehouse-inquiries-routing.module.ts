import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseInquiriesComponent } from './warehouse-inquiries/warehouse-inquiries.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseInquiriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseInquiriesRoutingModule {}
