import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { auctionReportComponent } from './auction-report/auction-report.component';

const routes: Routes = [
  {
    path: '',
    component: auctionReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class auctionReportRoutingModule {}
