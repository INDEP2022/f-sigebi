import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JprMaintenanceRecordsRoutingModule } from './jpr-maintenance-records-routing.module';
import { JprMaintenanceRecordsComponent } from './jpr-maintenance-records.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    JprMaintenanceRecordsComponent
  ],
  imports: [
    CommonModule,
    JprMaintenanceRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ]
})
export class JprMaintenanceRecordsModule { }
