import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseReportsComponent } from './warehouse-reports/warehouse-reports.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule {}
