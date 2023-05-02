import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnAbandonmentMonitorComponent } from './return-abandonment-monitor/return-abandonment-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnAbandonmentMonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnAbandonmentMonitorRoutingModule {}
