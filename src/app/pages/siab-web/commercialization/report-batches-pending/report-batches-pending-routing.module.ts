import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { reportBatchesPendingComponent } from './report-batches-pending/report-batches-pending.component';

const routes: Routes = [
  {
    path: '',
    component: reportBatchesPendingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class reportBatchesPendingRoutingModule {}
