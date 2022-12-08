import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCWinnersReportComponent } from './sw-comer-c-winners-report/sw-comer-c-winners-report.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCWinnersReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMWinnersReportRoutingModule {}
