import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprMaintenanceRecordsRoutingModule } from './jpr-maintenance-records-routing.module';
import { JprMaintenanceRecordsComponent } from './jpr-maintenance-records.component';

@NgModule({
  declarations: [JprMaintenanceRecordsComponent],
  imports: [
    CommonModule,
    JprMaintenanceRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprMaintenanceRecordsModule {}
