import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JprScheduledMaintenanceRoutingModule } from './jpr-scheduled-maintenance-routing.module';
import { JprScheduledMaintenanceComponent } from './jpr-scheduled-maintenance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    JprScheduledMaintenanceComponent
  ],
  imports: [
    CommonModule,
    JprScheduledMaintenanceRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ]
})
export class JprScheduledMaintenanceModule { }
