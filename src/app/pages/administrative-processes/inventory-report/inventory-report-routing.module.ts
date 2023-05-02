import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryReportRoutingModule {}
