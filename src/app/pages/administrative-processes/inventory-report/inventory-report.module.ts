import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryReportRoutingModule } from './inventory-report-routing.module';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    InventoryReportComponent
  ],
  imports: [
    CommonModule,
    InventoryReportRoutingModule,
    SharedModule,
  ]
})
export class InventoryReportModule { }
