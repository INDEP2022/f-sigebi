import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaRWhCWarehouseReportsComponent } from './warehouse-reports/pa-r-wh-c-warehouse-reports.component';

const routes: Routes = [
  {
    path: '',
    component: PaRWhCWarehouseReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaRWhMWarehouseRoutingModule { }
