import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositRequestMonitorComponent } from './deposit-request-monitor/deposit-request-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: DepositRequestMonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositRequestMonitorRoutingModule {}
