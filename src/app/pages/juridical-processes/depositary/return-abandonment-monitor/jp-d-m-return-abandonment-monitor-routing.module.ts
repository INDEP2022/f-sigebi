import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDRamCReturnAbandonmentMonitorComponent } from './jp-d-ram-c-return-abandonment-monitor/jp-d-ram-c-return-abandonment-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: JpDRamCReturnAbandonmentMonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMReturnAbandonmentMonitorRoutingModule {}
