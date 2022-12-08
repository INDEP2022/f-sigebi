import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCReportBatchesPendingComponent } from './sw-comer-c-report-batches-pending/sw-comer-c-report-batches-pending.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCReportBatchesPendingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMReportBatchesPendingRoutingModule {}
