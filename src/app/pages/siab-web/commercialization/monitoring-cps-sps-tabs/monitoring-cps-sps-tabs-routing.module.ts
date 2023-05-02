import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitoringCpsSpsTabsComponent } from './monitoring-cps-sps-tabs/monitoring-cps-sps-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: MonitoringCpsSpsTabsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitoringCpsSpsTabsRoutingModule {}
