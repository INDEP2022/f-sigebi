import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SwComerCMonitoringCpsSpsComponent } from './sw-comer-c-monitoring-cps-sps/sw-comer-c-monitoring-cps-sps.component';
import { SwComerMMonitoringCpsSpsRoutingModule } from './sw-comer-m-monitoring-cps-sps-routing.module';

@NgModule({
  declarations: [SwComerCMonitoringCpsSpsComponent],
  imports: [CommonModule, SwComerMMonitoringCpsSpsRoutingModule],
})
export class SwComerMMonitoringCpsSpsModule {}
