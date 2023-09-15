import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { monitoringCpsSpsModule } from '../monitoring-cps-sps/monitoring-cps-sps.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MonitoringCpsSpsTabsRoutingModule } from './monitoring-cps-sps-tabs-routing.module';
import { MonitoringCpsSpsTabsComponent } from './monitoring-cps-sps-tabs/monitoring-cps-sps-tabs.component';

@NgModule({
  declarations: [MonitoringCpsSpsTabsComponent],
  imports: [
    CommonModule,
    MonitoringCpsSpsTabsRoutingModule,
    SharedModule,
    TabsModule,
    monitoringCpsSpsModule,
    Ng2SmartTableModule,
  ],
})
export class MonitoringCpsSpsTabsModule {}
