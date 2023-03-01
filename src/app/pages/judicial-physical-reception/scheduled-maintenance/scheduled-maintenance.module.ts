import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ExcelReportComponent } from 'src/app/@standalone/excel-report/excel-report.component';
import { SelectFormComponent } from 'src/app/@standalone/shared-forms/select-form/select-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduledMaintenanceDetailComponent } from './scheduled-maintenance-detail/scheduled-maintenance-detail.component';
import { ScheduledMaintenanceRoutingModule } from './scheduled-maintenance-routing.module';
import { ScheduledMaintenanceComponent } from './scheduled-maintenance.component';

@NgModule({
  declarations: [
    ScheduledMaintenanceComponent,
    ScheduledMaintenanceDetailComponent,
  ],
  imports: [
    CommonModule,
    ScheduledMaintenanceRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    SelectFormComponent,
    ExcelReportComponent,
  ],
})
export class ScheduledMaintenanceModule {}
