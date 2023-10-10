import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { WarehouseTypeReportRoutingModule } from './warehouse-type-report-routing.module';
import { WarehouseTypeReportComponent } from './warehouse-type-report/warehouse-type-report.component';

@NgModule({
  declarations: [WarehouseTypeReportComponent],
  imports: [
    CommonModule,
    WarehouseTypeReportRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule,
    ModalModule.forChild(),
  ],
})
export class WarehouseTypeReportModule {}
