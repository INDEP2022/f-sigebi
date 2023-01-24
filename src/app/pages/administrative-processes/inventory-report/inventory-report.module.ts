import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryReportRoutingModule } from './inventory-report-routing.module';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';

@NgModule({
  declarations: [InventoryReportComponent],
  imports: [CommonModule, InventoryReportRoutingModule, SharedModule],
})
export class InventoryReportModule {}
