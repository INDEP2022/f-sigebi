import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComerAuctionReportFormComponent } from './comer-auction-report-form/comer-auction-report-form.component';

const routes: Routes = [
  {
    path: '',
    component: ComerAuctionReportFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComerAuctionReportRoutingModule {}
