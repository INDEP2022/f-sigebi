import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwComerCMonitoringCpsComponent } from './sw-comer-c-monitoring-cps/sw-comer-c-monitoring-cps.component';
import { SwComerCMonitoringSpsComponent } from './sw-comer-c-monitoring-sps/sw-comer-c-monitoring-sps.component';
import { SwComerMMonitoringCpsSpsRoutingModule } from './sw-comer-m-monitoring-cps-sps-routing.module';

@NgModule({
  declarations: [
    SwComerCMonitoringCpsComponent,
    SwComerCMonitoringSpsComponent,
  ],
  imports: [CommonModule, SwComerMMonitoringCpsSpsRoutingModule, SharedModule],
  exports: [SwComerCMonitoringCpsComponent, SwComerCMonitoringSpsComponent],
})
export class SwComerMMonitoringCpsSpsModule {}
