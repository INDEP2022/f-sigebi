import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprScheduledMaintenanceRoutingModule } from './jpr-scheduled-maintenance-routing.module';
import { JprScheduledMaintenanceComponent } from './jpr-scheduled-maintenance.component';

@NgModule({
  declarations: [JprScheduledMaintenanceComponent],
  imports: [
    CommonModule,
    JprScheduledMaintenanceRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprScheduledMaintenanceModule {}
