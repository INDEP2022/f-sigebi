import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchStatusMonitoringComponent } from './batch-status-monitoring/batch-status-monitoring.component';

const routes: Routes = [
  {
    path: '',
    component: BatchStatusMonitoringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchStatusMonitoringRoutingModule {}
