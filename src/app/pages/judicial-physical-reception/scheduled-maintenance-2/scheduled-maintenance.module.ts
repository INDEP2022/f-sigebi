import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduledMaintenanceRoutingModule } from './scheduled-maintenance-routing.module';
import { ScheduledMaintenanceComponent } from './scheduled-maintenance.component';

@NgModule({
  declarations: [ScheduledMaintenanceComponent],
  imports: [
    CommonModule,
    ScheduledMaintenanceRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class ScheduledMaintenanceModule {}
