import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportExposureForSaleComponent } from './report-exposure-for-sale/report-exposure-for-sale.component';

const routes: Routes = [
  {
    path: '',
    component: ReportExposureForSaleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportExposureForSaleRoutingModule {}
