import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SelectFormComponent } from 'src/app/@standalone/shared-forms/select-form/select-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceRecordsRoutingModule } from './maintenance-records-routing.module';
import { MaintenanceRecordsComponent } from './maintenance-records.component';
import { ProceedingInfoComponent } from './proceeding-info/proceeding-info.component';

@NgModule({
  declarations: [MaintenanceRecordsComponent, ProceedingInfoComponent],
  imports: [
    CommonModule,
    MaintenanceRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    SelectFormComponent,
  ],
})
export class MaintenanceRecordsModule {}
