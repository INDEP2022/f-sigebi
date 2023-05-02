import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealEstateAnalyticalReportComponent } from './real-estate-analytical-report/real-estate-analytical-report.component';

const routes: Routes = [
  {
    path: '',
    component: RealEstateAnalyticalReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealEstateAnalyticalReportRoutingModule {}
