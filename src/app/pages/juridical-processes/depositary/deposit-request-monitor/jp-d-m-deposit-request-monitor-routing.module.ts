import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDDrmCDepositRequestMonitorComponent } from './jp-d-drm-c-deposit-request-monitor/jp-d-drm-c-deposit-request-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: JpDDrmCDepositRequestMonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMDepositRequestMonitorRoutingModule {}
