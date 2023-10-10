import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseTypeReportComponent } from './warehouse-type-report/warehouse-type-report.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseTypeReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseTypeReportRoutingModule {}
