import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCMonitoringCpsSpsComponent } from './sw-comer-c-monitoring-cps-sps/sw-comer-c-monitoring-cps-sps.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCMonitoringCpsSpsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMMonitoringCpsSpsRoutingModule {}
