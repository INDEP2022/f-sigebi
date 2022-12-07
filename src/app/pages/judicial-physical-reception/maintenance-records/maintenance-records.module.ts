import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceRecordsRoutingModule } from './maintenance-records-routing.module';
import { MaintenanceRecordsComponent } from './maintenance-records.component';

@NgModule({
  declarations: [MaintenanceRecordsComponent],
  imports: [
    CommonModule,
    MaintenanceRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class MaintenanceRecordsModule {}
