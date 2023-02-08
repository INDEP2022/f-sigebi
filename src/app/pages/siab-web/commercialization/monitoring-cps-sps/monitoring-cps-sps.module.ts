import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { monitoringCpsSpsRoutingModule } from './monitoring-cps-sps-routing.module';
import { monitoringCpsComponent } from './monitoring-cps/monitoring-cps.component';
import { monitoringSpsComponent } from './monitoring-sps/monitoring-sps.component';

@NgModule({
  declarations: [monitoringCpsComponent, monitoringSpsComponent],
  imports: [CommonModule, monitoringCpsSpsRoutingModule, SharedModule],
  exports: [monitoringCpsComponent, monitoringSpsComponent],
})
export class monitoringCpsSpsModule {}
