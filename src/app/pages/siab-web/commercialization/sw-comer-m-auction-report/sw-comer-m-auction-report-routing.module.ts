import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCAuctionReportComponent } from './sw-comer-c-auction-report/sw-comer-c-auction-report.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCAuctionReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMAuctionReportRoutingModule {}
